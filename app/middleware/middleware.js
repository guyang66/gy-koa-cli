module.exports = app => {
  return async function(ctx, next) {
    console.log('before middleware')
    // do something
    await next();
    console.log('after middleware')
  };
}
