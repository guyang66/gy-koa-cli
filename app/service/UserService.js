const BaseClass = require('../base/BaseClass')
class UserService extends BaseClass{

  /**
   * get current user info
   * @returns {Promise<string>}
   */
  async getCurrentUser () {
    return 'Catherine'
  }

}
module.exports = UserService;
