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
  as: 'languages',
  attributes: ['id', 'title'],
  through: {
    attributes: [],
  },
};

const api = new API({
  prefix: '/api',
})

// user APIs
.get('/me', permit(), wraps(function* (next) {
  this.body = {
    data: this.state.user,
  };
}, {
  doc: 'Get current user details',
}))
.get('/me/quizzes', permit(), wraps(function* (next) {
  const quizzes = yield models.quiz.findAll({
    where: {
      isEnabled: true,
    },
    include: [
      includeLanguages,
      Object.assign({}, includeUsers, {
        where: {
          id: this.state.user.id,
        },
      }),
    ],
  });
  this.body = {
    data: quizzes,
  };
}, {
  doc: 'Get quiz list of current user',
}))
.get('/me/quizzes/:id', permit(), wraps(function* (next) {
  const userQuiz = yield model.findOne({
    user: this.state.user.id,
    quiz: this.params.id,
  })
  .select('quiz solutions -_id')
  .populate('quiz', 'title description languages')
  .populate('solutions.language quiz.languages', 'title value', null, {isEnabled: true});
  this.body = {
    data: userQuiz,
  };
}, {
  doc: 'Get detail of a user\'s quiz',
}))
.post('/me/quizzes/:id', permit(), wraps(function* (next) {
  const userQuiz = yield model.findOne({
    user: this.state.user.id,
    quiz: this.params.id,
  });
  const {code, language} = this.request.body;
  userQuiz.solutions.push({code, language});
  yield userQuiz.save();
  this.status = 201;
  this.body = {
    error: null,
  };
}, {
  doc: 'Post a solution for a quiz'
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
.get('/users/:id/quizzes', permit('admin'), wraps(function* (next) {
  const {q} = this.query;
  const includeUsersA = Object.assign({}, includeUsers, {
    required: !q,
    where: {
      id: this.params.id,
    },
    attributes: ['id'],
    through: {
      attributes: [],
    },
  });
  const quizzes = yield models.quiz.findAll({
    where: whereLike(q, [
      'title',
      'description',
    ]),
    include: [
      includeLanguages,
      includeUsersA,
    ],
  });
  this.body = {
    data: quizzes,
  };
}, {
  doc: `Get quizzes that the user can see.

If 'params.q' is provided, all filtered quizzes will be returned
with 'users' field indicating whether the current user can see it.
`,
}))
.put('/users/:id/quizzes/:quizId', permit('admin'), wraps(function* (next) {
  const {id, quizId} = this.params;
  const user = yield models.user.findById(id);
  const quiz = yield models.quiz.findById(quizId);
  yield user.addQuiz(quiz);
  this.body = null;
}, {
  doc: 'Add a quiz to the user\'s list.',
}))
.delete('/users/:id/quizzes/:quizId', permit('admin'), wraps(function* (next) {
  const {id, quizId} = this.params;
  const user = yield models.user.findById(id);
  const quiz = yield models.quiz.findById(quizId);
  yield user.removeQuiz(quiz);
  this.body = null;
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
      include: [includeLanguages],
    };
  },
})
.get('/quizzes/:id', permit('admin'), {
  Model: models.quiz,
  query: {
    include: [includeLanguages],
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
  *after(data, ctx, item) {
    const {languages} = data;
    yield item.setLanguages(languages);
    yield item.reload({
      include: [includeLanguages],
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
    include: [includeLanguages],
  },
  *after(data, ctx, item) {
    const {languages} = data;
    yield item.setLanguages(languages);
    yield item.reload({
      include: [includeLanguages],
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

function* getQuizzesByUserId(id, query) {
  const quizzes = yield models.quiz.findAll(query);
  return quizzes;
}
