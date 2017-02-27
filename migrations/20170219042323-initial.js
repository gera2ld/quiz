'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      openId: {
        type: Sequelize.STRING,
        unique: true,
      },
      login: Sequelize.STRING,
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      avatar: Sequelize.STRING,
      permissions: Sequelize.TEXT,
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    })
    .then(() => queryInterface.createTable('quizzes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      title: Sequelize.STRING,
      description: Sequelize.TEXT,
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      creatorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'set null',
      },
    }))
    .then(() => queryInterface.createTable('languages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      title: {
        type: Sequelize.STRING,
        unique: true,
      },
      value: {
        type: Sequelize.STRING,
        unique: true,
      },
      isEnabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
    }))
    .then(() => queryInterface.createTable('quizLangs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      quizId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'quizzes',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      languageId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'languages',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    }))
    .then(() => queryInterface.createTable('userQuizzes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      quizId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'quizzes',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    }))
    .then(() => queryInterface.createTable('solutions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      code: {
        type: Sequelize.TEXT,
      },
      userQuizId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'userQuizzes',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      languageId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'languages',
          key: 'id',
        },
        onDelete: 'set null',
      },
    }))
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('solutions')
    .then(() => queryInterface.dropTable('userQuizzes'))
    .then(() => queryInterface.dropTable('quizLangs'))
    .then(() => queryInterface.dropTable('languages'))
    .then(() => queryInterface.dropTable('quizzes'))
    .then(() => queryInterface.dropTable('users'))
  }
};
