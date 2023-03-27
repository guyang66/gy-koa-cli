function initDataBase(app) {
  const { commonLogger, dbLogger } = app.$log4
  const localStringify = (object) => {
    return JSON.stringify(object, function (k, v) {
      if (v instanceof RegExp) {
        return v.toString();
      }
      return v;
    })
  }
  const mongoose = require('mongoose').set('debug', function (collectionName, method, query, doc) {
    let str = collectionName + '.' + method + '(' + localStringify(query) + ',' + localStringify(doc) + ')'
    dbLogger.info(str)
  });
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }
  const config = app.$config
  let dbConfig = config.mongodb
  if(!dbConfig.user || dbConfig.user === ''){
    console.log(chalk.red('need database config items，please set the「config.json-> mongodb」！'))
  }
  const uri = 'mongodb://' + `${dbConfig.user}` + ':' + `${encodeURIComponent(dbConfig.pass)}` + '@' + `${dbConfig.servername}`  + ':' + `${dbConfig.port}` + '/' + `${dbConfig.database}`
  let url = uri + '?gssapiServiceName=mongodb'
  mongoose.connect(url,options,function (){})
  let db = mongoose.connection

  db.on('error', (error)=>{
    errorLogger.error('mongoDB Connection fail！' + error)
    console.log(chalk.red('mongoDB Connection fail！' + error));
  });
  db.once('open', ()=> {
    commonLogger.info("============== mongoDB Connection successfully. =================");
    console.log(chalk.green('============== mongoDB Connection successfully. ================='));
  })
  app.$mongoose = mongoose
  app.$db = db
}
