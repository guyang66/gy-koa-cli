const path = require('path')
const log4js = require('koa-log4')
const config = require('../config.json')
const isPrd = process.env.NODE_ENV === 'production'
const rootPath = isPrd ? config.log.prdRootPath : config.log.rootPath

log4js.configure({
  appenders: {
    error:{
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.join(`${rootPath}`, 'error.log'), //生成文件名
      backups: 30,
    },
    common: {
      type: 'file',
      filename: path.join(`${rootPath}`, 'common.log'), //生成文件名
      maxLogSize: 10485760 * 10, // 100mb,日志文件大小,超过该size则自动创建新的日志文件
      backups: 5,
    },
    db: {
      type: 'dateFile',
      pattern: '-yyyy-MM-dd.log', //生成文件的规则
      filename: path.join(`${rootPath}`, 'db.log'), //生成文件名
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
      level: isPrd ? 'off' : 'all' // 生产环境默认关闭
    },
  }
});
const errorLogger = log4js.getLogger('error')
const commonLogger = log4js.getLogger('common')
const dbLogger = log4js.getLogger('db')
module.exports = {errorLogger, commonLogger, dbLogger}
