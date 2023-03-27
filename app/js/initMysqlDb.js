function initDataBase(app) {
  const Sequelize = require('sequelize');
  const chalk = require('chalk');
  const { commonLogger, errorLogger, dbLogger } = app.$log4
  const config = app.$config.mysql
  if(!config.user || config.user === ''){
    console.log(chalk.red('need database config items，please set the「config.json-> mysql」！'))
  }
  const sequelize = new Sequelize(config.database, config.user, config.password,{
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    logging: function (sql) {
      // sql log
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
