module.exports = function (sequelize, DataTypes) {
  const solution = sequelize.define('solution', {
    code: DataTypes.TEXT,
  });
  solution.associate = function (models) {
    solution.belongsTo(models.userQuiz);
    solution.belongsTo(models.language);
  };
  return solution;
};
