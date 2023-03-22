const BaseClass = require('../base/BaseClass')
class UserService extends BaseClass{

  /**
   * 获取当前用户信息
   * @returns {Promise<string>}
   */
  async getCurrentUser () {
    return 'Catherine'
  }

}
module.exports = UserService;
