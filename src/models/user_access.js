"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserAccess extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserAccess.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "users",
      });
    }
  }

  UserAccess.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      session_token: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserAccess",
      tableName: "user_accesses",
      timestamps: true,
      underscored: true,
    },
  );
  return UserAccess;
};
