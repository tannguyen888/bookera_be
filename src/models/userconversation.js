const { DataTypes } = require('sequelize');
const { sequelize } = require("../config/sequelize_db_orm");

const userconversation = sequelize.define(
    'userconverstation',
    {
        user_id:{
            type: DataTypes.INTERGER,
            allowNull: false,
        },
        
        conversation_id: {
            type:DataTypes.INTERGER,
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timpestamps: false,
    }
);

module.exports = userconversation;