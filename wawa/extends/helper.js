module.exports = app => ({
  Result : {
    success (content) {
      return {
        success: true,
        data: content,
        errorCode: null,
        errorMessage: null
      }
    },
    fail (code, message) {
      return {
        success: false,
        data: null,
        errorCode: code,
        errorMessage: message ? message : ''
      }
    }
  }
})
