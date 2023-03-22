function initDataBase(app) {
  const Sequelize = require('sequelize');
  const chalk = require('chalk');
  const { commonLogger, errorLogger, dbLogger } = app.$log4
  const config = app.$config.mysql
  if(!config.user || config.user === ''){
    console.log(chalk.red('数据库配置项不存在，请先在【config.json】中设置mysql配置项！'))
    // throw new Error('数据库配置项不存在，请先在【config.json】中设置mysql配置项！')
  }
  const sequelize = new Sequelize(config.database, config.user, config.password,{
    host: config.host,    //数据库地址,默认本机
    port: config.port,
    dialect: 'mysql',
    pool: {   //连接池设置
      max: 5, //最大连接数
      min: 0, //最小连接数
      idle: 10000
    },
    logging: function (sql) {
      // 输出到日志中
      if(process.env.NODE_ENV === 'development'){
        dbLogger.info(sql)
      }
    }
  })

  sequelize.authenticate().then(()=>{
    commonLogger.info('=============== mysql Connection successfully.=================')
    console.log(chalk.green('=============== mysql Connection successfully.================='));
  }).catch(err=>{
    errorLogger.error('mysql Unable to connect to the database:',err)
    console.log(chalk.red('mysql Unable to connect to the database:',err));
  });

  app.$sequelize = sequelize
}
