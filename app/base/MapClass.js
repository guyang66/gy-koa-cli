const is = require('is-type-of');
/**
 * Reference 『eggjs』
 */
class MapClass {
  constructor(options) {
    const { ctx, properties } = options
    for (const property in properties) {
      if(!properties.hasOwnProperty(property)){
        continue
      }
      Object.defineProperty(this, property,{
        get() {
          if(!is.class(properties[property])){
            throw new Error(`${property}is not a class`)
          }
          return new properties[property](ctx)
        }
      })
    }
  }
}
module.exports = MapClass
