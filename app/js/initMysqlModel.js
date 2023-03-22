function initModel(app){
  let model = {};
  scanFilesByFolder('./model',(filename, modelConfig)=>{
    model[filename] = modelConfig({...app});
  });
  app.$model = model
}
