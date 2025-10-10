// models/hero.js
const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class Hero extends Model {}

Hero.init(
  {
    hero_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_entered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "hero",
  }
);

// Export Hero model
module.exports = Hero;
