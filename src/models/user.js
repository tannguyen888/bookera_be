"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //   User.belongsTo(models.UserRole, { foreignKey: "roleID" });
      //   User.hasMany(models.UserWatchList, { foreignKey: "userID" });
      //   User.hasMany(models.UserViewHistory, { foreignKey: "userID" });
      //   User.hasMany(models.UserReview, { foreignKey: "userID" });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      role_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,
    },
  );
  return User;
};
