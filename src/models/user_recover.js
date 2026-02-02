"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRecover extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRecover.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }

  UserRecover.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },

      recover_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserRecover",
      tableName: "user_recovers",
      timestamps: true,
      underscored: true,
    },
  );
  return UserRecover;
};
