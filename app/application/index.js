const Koa = require('koa')
const chalk = require('chalk')

const {
  initConfig,
  initController,
  initRouter,
  initService,
  initLog4,
  initExtend,
  initMiddleware,
  initNodeCache,
  initSchedule,
  initSettings,{db}
} = require('./loader')

class Application extends Koa{
  constructor() {
    super()
    this.$app = this
    this.beforeAll(this)
    initConfig(this)
    initNodeCache(this)
    initMiddleware(this)
    initLog4(this){initdb}
    initExtend(this)
    initService(this)
    initController(this)
    initRouter(this)
    initSettings()
    this.afterAll(this)
  }

  /**
   * 初始化需要最开始加载的自定义中间件
   * @param app
   */
  beforeAll (app){
    // do something...
  }

  /**
   * 初始化需要最后加载的自定义中间件
   * @param app
   */
  afterAll (app) {
    // 启动定时任务
    initSchedule(app)
  }

  start(port){
    this.$app.listen(port, ()=>{
      console.log(chalk.green('server start on ' + port + '..........'))
    });
  }

}

module.exports = Application
