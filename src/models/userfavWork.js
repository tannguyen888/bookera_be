const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize_db_orm');
const FavWork = require('./favWork');

const userFavWork = sequelize.define(
    'userfaveWork',
 {
    id:{
      type: DataTypes.INTERGER,
      autoIncrement: true,
      primaryKey: true,
    },
     user_id: {
        type: DataTypes.INTERGER(10),
        allowNull: false,
    },
    fave_work_id:
    {
        type:DataTypes.INTERGER(10),
        allowNull: false,
    }
 },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = userFavWork;