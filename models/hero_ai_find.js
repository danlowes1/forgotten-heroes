// models/hero_ai_find.js
const { Model, DataTypes, Sequelize } = require("sequelize");

const sequelize = require("../config/connection");

class Hero_ai_find extends Model {}

Hero_ai_find.init(
 {
    hero_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'hero', 
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    findDate: {
      type: DataTypes.DATEONLY, 
      allowNull: false,
      defaultValue: Sequelize.NOW,

    },
    ai_model: {
      type: DataTypes.TEXT,
      allowNull: true,
      sefaultValue: 'Gemini'
    },

  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "hero_ai_find",
  }
);

// Export Hero_ai_find model
module.exports = Hero_ai_find;
