module.exports = function (sequelize, DataTypes) {
  const userQuiz = sequelize.define('userQuiz', {
    // primary key should be defined explicitly since this is a join table
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  }, {
    tableName: 'userQuizzes',
  });
  userQuiz.associate = function (models) {
    userQuiz.belongsTo(models.user);
    userQuiz.belongsTo(models.quiz);
    userQuiz.hasMany(models.solution);
  };
  return userQuiz;
};
