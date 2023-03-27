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
  // insert the common data in this place
  app.use(async (ctx,next)=>{
    ctx.state = {
      tdk: tdk,
    }
    await next();
  });
