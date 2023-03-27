/**
 * Reference 『eggjs』
 */
class BaseClass {
  constructor(ctx) {
    // save the context in base class
    this.ctx = ctx
    this.app = ctx.app
    this.service = ctx.service
  }
}
module.exports = BaseClass
