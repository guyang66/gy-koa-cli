  // ejs模板引擎
  const views = require('koa-views');
  const tdk = {
    title: 'appName',
    description: '',
    keywords: ''
  }
  app.use(views(path.resolve(__dirname, '../views'), {
    extension: 'ejs',
    async: true
  }))
  // 页面公共数据
  app.use(async (ctx,next)=>{
    ctx.state = {
      tdk: tdk,
    }
    await next();
  });
