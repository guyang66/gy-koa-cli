const Router = require('koa-router');
const chalk = require('chalk');
const path = require('path')
const MapLoader = require('../base/MapClass')
const {errorLogger} = require('../common/log4')
const { scanFilesByFolder, methodToMiddleware } = require('../utils.js')

const initConfig = function (app) {
  let config = {};
  const projectConfig = require('../config.json')
  config = {...config, ...projectConfig};
  app.$config = config;
}

const initController = function(app){
  let map = {}
  scanFilesByFolder('./controller/', function (filename, Controller){
    let proto = Controller.prototype
    let ret = {}
    const keys = Object.getOwnPropertyNames(proto);
    for(const key of keys){
      if (key === 'constructor') {
        continue;
      }
      ret[key] = methodToMiddleware(Controller, key);
    }
    map[filename] = ret
  })

  app['controller'] = map
}

// 初始化路由
const initRouter = function(app){
  const router = new Router();
  scanFilesByFolder('./routes',(filename, route)=>{
    route({...app, router})
  })
  app.$router =  router;
  // 挂在router
  app.use(router.routes());
}

const initService = function (app){
  let serviceMap = {}
  scanFilesByFolder('./service/',function (filename, Service){
    serviceMap[filename] = Service
  })
  Object.defineProperty(app.context, 'service', {
    get() {
      return new MapLoader({ctx: this, properties: serviceMap})
    }
  })
  app.service = serviceMap
}

// 初始化扩展
const initExtend = function (app) {
  scanFilesByFolder('./extends',(filename, extendFn)=>{
    app['$' + filename] = Object.assign(app['$' + filename] || {}, extendFn(app))
  })
}

// 初始化中间件middleware
const initMiddleware = function (app){
  let middleware = {}
  scanFilesByFolder('./middleware',(filename, middlewareConf)=>{
    middleware[filename] = middlewareConf(app);
  })
  app.$middleware = middleware;
  // 初始化koa相关中间件
  initDefaultMiddleware(app)
}

const initLog4 = function (app) {
  app.$log4 = require('../common/log4');
}

const initNodeCache = function (app) {
  const NodeCache = require('node-cache')
  app.$nodeCache = new NodeCache()
}

const  initSchedule = function (app) {
  const schedule = require('node-schedule');
  const { commonLogger } = app.$log4
  let schedules = {}
  scanFilesByFolder('./schedule',(filename, scheduler)=>{
    if(scheduler(app).open){
      schedules[filename] = schedule.scheduleJob(scheduler(app).interval,scheduler(app).handler)
      console.log(chalk.cyan('定时器：' + filename, '已启动！'))
      commonLogger.info('定时器：' + filename, '已启动')
    } else {
      console.log(chalk.yellow('定时器：' + filename, '设置为不启动！'))
      commonLogger.info('定时器：' + filename, '设置为不启动！')
    }
  })
  app.$schedule = schedules;
}

const initDefaultMiddleware = function (app) {
  const json = require('koa-json');
  const onerror = require('koa-onerror');
  const koaStatic = require('koa-static');
  const koaBody = require('koa-body');
  const cors = require('koa2-cors');

  // 静态资源 - 1天的缓存
  let opts = process.env.NODE_ENV === 'production' ? { maxage: 24 * 60 * 60  * 1000} : {}
  app.use(koaStatic(path.resolve(__dirname, '../public'), opts))

  app.use(koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 3000 * 1024 * 1024    // 设置上传文件大小最大限制，默认30M
    }
  }));
  app.use(cors());
  app.use(json())
  onerror(app)
  {ejs}
}

const initSettings = function () {
  // 重写console 生产环境控制台不输出信息
  console.log = (function (ori){
    return function (){
      if(process.env.NODE_ENV !== 'production'){
        ori.apply(this,arguments)
      }
    }
  })(console.log);
}
{initModel}{initDatabase}
module.exports = {
  initSettings,
  initController,
  initRouter,
  initMiddleware,
  initService,
  initConfig,
  initLog4,
  initNodeCache,
  initExtend,
  initSchedule,{exportdb}
}
