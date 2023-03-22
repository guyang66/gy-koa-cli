const BaseClass = require('../base/BaseClass')
class PageController extends BaseClass {
  async view() {
    const { ctx } = this
    await ctx.render('index', {
      data: 'this is render data',
    })
  }
}
module.exports = PageController
