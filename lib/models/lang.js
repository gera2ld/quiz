module.exports = function (sequelize, DataTypes) {
  const language = sequelize.define('language', {
    title: {
      type: DataTypes.STRING,
      unique: true,
    },
    value: {
      type: DataTypes.STRING,
      unique: true,
    },
    isEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  return language;
};