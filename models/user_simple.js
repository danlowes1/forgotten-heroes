const { Model, DataTypes } = require("sequelize");

const sequelize = require("../config/connection");

class User extends Model {}

User.init(
  {
    user_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    //   last_name: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    // },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "user",
  }
);

// Export model
module.exports = User;