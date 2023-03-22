const Sequelize = require('sequelize');
module.exports = app => {
  const { $sequelize } = app;
  const Contract = {
    id: {
      field: 'id',
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      filed: 'user_name',
      type: Sequelize.DataTypes.STRING(512)
    },
    password: {
      filed: 'password',
      type: Sequelize.DataTypes.STRING(512)
    },
    nickname: {
      filed: 'nick_name',
      type: Sequelize.DataTypes.STRING(512)
    },
    remark: {
      filed: 'remark',
      type: Sequelize.DataTypes.STRING(300)
    },
    status: {
      filed: 'status',
      type: Sequelize.DataTypes.BIGINT()
    }
  }
  return $sequelize.define('user',Contract,{
    freezeTableName: true,
    modelName: 'user',
    timestamps: false,
  })
}
