"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });

      User.hasOne(models.UserAccess, {
        foreignKey: "user_id",
        as: "user_accesses",
      });

      User.hasOne(models.UserRecover, {
        foreignKey: "user_id",
        as: "user_recover",
      });

      // associations define in models/index.js
    }

  
    async comparePassword(plainPassword) {
      return bcrypt.compare(plainPassword, this.password);

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
        allowNull: true, 
      },


      name_change_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },

      role_id: { type: DataTypes.INTEGER, allowNull: false },

      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, 
      },

    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
      underscored: true,

      hooks: {
        
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  return User;
};
