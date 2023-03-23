const BaseClass = require('../base/BaseClass')
class UserController extends BaseClass {
  async getUser() {
    const { service, app, ctx } = this
    const { $helper } = app
    let user = await service.UserService.getCurrentUser()
    ctx.body = $helper.Result.success(user)
  }
}
module.exports = UserController
