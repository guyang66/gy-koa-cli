const Application = require('./application');

// 创建实例
const app = new Application();

// 启动实例
app.start(app.$config.port || 8090);
