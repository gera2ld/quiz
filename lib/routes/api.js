const models = require('../models');
const {permit, wraps} = require('../utils');
const {API, whereLike} = require('../utils/restful');

const includeUsers = {
  model: models.user,
  as: 'users',
  attributes: [],
};
const includeLanguages = {
  model: models.language,
  attributes: ['id', 'title', 'value'],
};
const includeQuizLanguages = Object.assign({
  as: 'languages',
  through: {
    attributes: [],
  },
}, includeLanguages);

const api = new API({
  prefix: '/api',
})

// user APIs
.get('/me', permit(), wraps(function (ctx, next) {
  ctx.body = {
    data: ctx.state.user,
  };
}, {
  doc: 'Get current user details',
}))
.get('/me/quizzes', permit(), wraps(async function (ctx, next) {
  const quizzes = await models.quiz.findAll({
    where: {
      isEnabled: true,
    },
    include: [
      includeQuizLanguages,
      Object.assign({}, includeUsers, {
        where: {
          id: ctx.state.user.id,
        },
      }),
    ],
  });
  ctx.body = {
    data: quizzes,
  };
}, {
  doc: 'Get quiz list of current user',
}))
.get('/me/quizzes/:id', permit(), wraps(async function (ctx, next) {
  const quiz = await models.quiz.findOne({
    where: {
      id: ctx.params.id,
      isEnabled: true,
    },
    include: [
      includeQuizLanguages,
      Object.assign({}, includeUsers, {
        where: {
          id: ctx.state.user.id,
        },
      }),
    ],
  });
  ctx.body = {
    data: quiz,
  };
}, {
  doc: 'Get detail of a user\'s quiz',
}))
.post('/me/quizzes/:id', permit(), wraps(async function (ctx, next) {
  const userQuiz = await model.findOne({
    user: ctx.state.user.id,
    quiz: ctx.params.id,
  });
  const {code, language} = ctx.request.body;
  userQuiz.solutions.push({code, language});
  await userQuiz.save();
  ctx.status = 201;
  ctx.body = null;
}, {
  doc: 'Post a solution for a quiz'
}))
.get('/me/quizzes/:id/solutions', permit(), wraps(async function (ctx, next) {
  const solutions = await models.solution.findAll({
    include: [
      includeLanguages,
      {
        model: models.userQuiz,
        attributes: [],
        include: [
          {
            model: models.user,
            attributes: [],
            where: {
              id: ctx.state.user.id,
            },
          },
          {
            model: models.quiz,
            attributes: [],
            where: {
              id: ctx.params.id,
            },
          },
        ],
      },
    ],
  });
  ctx.body = {
    data: solutions,
  };
}, {
  doc: 'Get a user\'s solutions to a quiz',
}))
.post('/me/quizzes/:id/solutions', permit(), wraps(async function (ctx, next) {
  const userQuiz = await models.userQuiz.findOne({
    include: [
      {
        model: models.user,
        where: {
          id: ctx.state.user.id,
        },
      },
      {
        model: models.quiz,
        where: {
          id: ctx.params.id,
        },
      },
    ],
  });
  const {code, languageId} = ctx.request.body;
  const language = languageId && await models.language.findById(languageId);
  if (!userQuiz || !language || !code) {
    ctx.status = 422;
    ctx.body = {
      error: 'Invalid data',
    };
    return;
  }
  const solution = await models.solution.create({
    code, languageId,
    userQuizId: userQuiz.id,
  });
  await solution.reload({
    include: [
      includeLanguages,
    ],
  });
  ctx.status = 201;
  ctx.body = {
    data: solution,
  };
}, {
  doc: 'Submit a new solution for a quiz',
}))

// admin APIs
.getList('/users', permit('admin'), {
  Model: models.user,
})
.get('/users/:id', permit('admin'), {
  Model: models.user,
})
.patch('/users/:id', permit('admin'), {
  Model: models.user,
  getData(data, ctx) {
    const updates = {};
    const {permissions, isEnabled} = data;
    if (permissions != null) updates.permissions = permissions;
    if (isEnabled != null) updates.isEnabled = !!isEnabled;
    return updates;
  },
})
.get('/users/:id/quizzes', permit('admin'), wraps(async function (ctx, next) {
  const {q} = ctx.query;
  const includeUsersA = Object.assign({}, includeUsers, {
    required: !q,
    where: {
      id: ctx.params.id,
    },
    attributes: ['id'],
    through: {
      attributes: [],
    },
  });
  const quizzes = await models.quiz.findAll({
    where: whereLike(q, [
      'title',
      'description',
    ]),
    include: [
      includeQuizLanguages,
      includeUsersA,
    ],
  });
  ctx.body = {
    data: quizzes,
  };
}, {
  doc: `Get quizzes that the user can see.

If \`params.q\` is provided, all filtered quizzes will be returned
with \`users\` field indicating whether the current user can see it.
`,
}))
.put('/users/:id/quizzes/:quizId', permit('admin'), wraps(async function (ctx, next) {
  const {id, quizId} = ctx.params;
  const user = await models.user.findById(id);
  const quiz = await models.quiz.findById(quizId);
  await user.addQuiz(quiz);
  ctx.body = null;
}, {
  doc: 'Add a quiz to the user\'s list.',
}))
.delete('/users/:id/quizzes/:quizId', permit('admin'), wraps(async function (ctx, next) {
  const {id, quizId} = ctx.params;
  const user = await models.user.findById(id);
  const quiz = await models.quiz.findById(quizId);
  await user.removeQuiz(quiz);
  ctx.body = null;
}, {
  doc: 'Remove a quiz from the user\'s list.',
}))
.getList('/quizzes', permit('admin'), {
  Model: models.quiz,
  query(ctx) {
    return {
      where: whereLike(ctx.query.q, [
        'title',
        'description',
      ]),
      include: [includeQuizLanguages],
    };
  },
})
.get('/quizzes/:id', permit('admin'), {
  Model: models.quiz,
  query: {
    include: [includeQuizLanguages],
  },
})
.post('/quizzes', permit('admin'), {
  Model: models.quiz,
  getData(data, ctx) {
    const {title, description} = data;
    return {
      title, description,
      creatorId: ctx.state.user.id,
    };
  },
  async after(data, ctx, item) {
    const {languages} = data;
    await item.setLanguages(languages);
    await item.reload({
      include: [includeQuizLanguages],
    });
  },
})
.put('/quizzes/:id', permit('admin'), {
  Model: models.quiz,
  getData(data, ctx) {
    const {title, description} = data;
    return {title, description};
  },
  query: {
    include: [includeQuizLanguages],
  },
  async after(data, ctx, item) {
    const {languages} = data;
    await item.setLanguages(languages);
    await item.reload({
      include: [includeQuizLanguages],
    });
  },
})
.delete('/quizzes/:id', permit('admin'), {
  Model: models.quiz,
})

.getList('/languages', permit('admin'), {
  Model: models.language,
})
.post('/languages', permit('admin'), {
  Model: models.language,
  getData(data, ctx) {
    const {title, value} = data;
    return {title, value};
  },
})
.put('/languages/:id', permit('admin'), {
  Model: models.language,
  getData(data, ctx) {
    const {title, value} = data;
    return {title, value};
  },
})

module.exports = api.routes();
