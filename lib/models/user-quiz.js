module.exports = function (sequelize, DataTypes) {
  const userQuiz = sequelize.define('userQuiz', {
  }, {
    tableName: 'userQuizzes',
  });
  return userQuiz;
};