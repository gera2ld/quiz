module.exports = function (sequelize, DataTypes) {
  const quiz = sequelize.define('quiz', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'quizzes',
  });
  quiz.associate = function (models) {
    quiz.belongsTo(models.user, {as: 'creator'});
    quiz.belongsToMany(models.user, {
      as: 'users',
      through: models.userQuiz,
    });
    quiz.belongsToMany(models.language, {
      as: 'languages',
      through: models.quizLang,
    });
  };
  return quiz;
};
