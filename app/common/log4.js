const path = require('path')
const log4js = require('koa-log4')
const config = require('../config.json')
const isPrd = process.env.NODE_ENV === 'production'
const rootPath = isPrd ? config.log.prdRootPath : config.log.rootPath
log4js.configure({
  appenders: {
    error:{
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join(`${rootPath}`, 'error.log'),
      backups: 30,
    },
    common: {
      type: 'file',
      filename: path.join(`${rootPath}`, 'common.log'),
      maxLogSize: 10485760 * 10,
      backups: 5,
    },
    db: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log',
      filename: path.join(`${rootPath}`, 'db.log'),
      backups: 30,
    },
    out: {
      type: 'console'
    },
  },
  categories: {
    default: { appenders: [ 'out' ], level: 'info' },
    error:{
      appenders: ['error'],
      level: 'error'
    },
    common: {
      appenders: ['common'],
      level: 'all'
    },
    db: {
      appenders: ['db'],
      level: isPrd ? 'off' : 'all' // we should close the database sql log at prd env
    },
  }
});
const errorLogger = log4js.getLogger('error')
const commonLogger = log4js.getLogger('common')
const dbLogger = log4js.getLogger('db')
module.exports = {errorLogger, commonLogger, dbLogger}
