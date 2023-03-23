module.exports = app => {
  const { router, controller, $middleware } = app;
  router.get('/user', controller.UserController.getUser)
  router.post('/user2', $middleware.middleware, controller.UserController.getUser)
}
