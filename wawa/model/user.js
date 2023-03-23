module.exports = app => {
  const { mongoose, baseModel } = app;
  const User = new mongoose.Schema(
    Object.assign({}, baseModel, {
      username: { type: String, unique: true, required: [true,'username不能为空'] },
      password: { type: String, required: [true,'password不能为空'] },
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

