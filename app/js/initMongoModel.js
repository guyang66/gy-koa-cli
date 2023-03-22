const initModel = function (app) {
  let model = {};
  const mongoose = require('mongoose')
  const BaseModel = require('../model/base.js')
  scanFilesByFolder('./model',(filename, modelConfig)=>{
    model[filename] = modelConfig({...app, mongoose, BaseModel});
  });
  app.$model = model
}
