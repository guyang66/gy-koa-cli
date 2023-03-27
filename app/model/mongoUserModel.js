module.exports = app => {
  const { mongoose, baseModel } = app;
  const User = new mongoose.Schema(
    Object.assign({}, baseModel, {
      username: { type: String, unique: true, required: [true,'the username cannot be empty'] },
      password: { type: String, required: [true,'the password cannot be empty'] },
      nickname: { type: String, default: '' },
      remark: { type: String },
      status: { type: Number, default: 1 }
    }), {
      timestamps: { createdAt: 'createTime', updatedAt: 'modifyTime'},
      collection: "user",
    }
  )
  return mongoose.model('user', User);
}

