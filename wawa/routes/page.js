module.exports = app => {
  const { router, controller } = app;
  router.get('/view', controller.PageController.view)
}
