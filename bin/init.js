#!/usr/bin/env node

const program = require('commander');
const mkdirp = require('mkdirp')
const inquirer = require('inquirer')
const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk')
const pkg = require('../package.json');
const { spawn } = require('child_process')
const version = pkg.version
const eol = os.EOL;
program
  .version(version)
  .usage('[options] [dir]')
  .parse(process.argv)
// 执行
main();

async function main () {
  // 创建主目录
  let targetPath = program.args.shift()
  if(!targetPath){
    // 提示输入appName
    let p1 = await inquirer.prompt([
      {
        type: 'input',
        message: 'input your application name',
        name: 'appName'
      }
    ])
    targetPath = p1.appName
  }

  if(getFileStat(targetPath)){
    console.log(targetPath, chalk.red('目标目录已经存在文件，无法继续创建，请尝试更换目录或应用名称！'))
    return
  }

  // 输出完整目录
  targetPath = path.resolve(process.cwd(),targetPath)

  let appName = path.basename(path.resolve(targetPath));
  let p2 = await inquirer.prompt([
    {
      type: 'list',
      message: 'need database？',
      choices: [
        'mongodb',
        'mysql',
        'no database'
      ],
      name: 'database'
    }
  ])

  let p3 = await inquirer.prompt([
    {
      type: 'list',
      message: 'need template engine ?',
      choices: [
        'ejs',
        'no engine'
      ],
      name: 'template'
    }
  ])

  let p4 = await inquirer.prompt([
    {
      type: 'input',
      message: 'need .gitignore? Y/N',
      name: 'gitignore'
    }
  ])

  let p5 = await inquirer.prompt([
    {
      type: 'input',
      message: 'need README.md? Y/N',
      name: 'readme'
    }
  ])
  await create({
    appName,
    targetPath,
    database: p2.database,
    template: p3.template,
    gitignore: p4.gitignore,
    readme: p5.readme
  })
  // 改变操作目录
  process.chdir(targetPath)
  spawn('npm', ['install'], {stdio: 'inherit'})
}

async function create ({appName, targetPath, database, template, gitignore, readme}) {
  // 创建应用目录
  await createDirectory(targetPath)
  // 创建 app.js
  let appjs =  loadFile('app.js')
  writeFile(path.join(targetPath, 'app.js'), appjs)

  // 创建 application
  await createDirectory(path.join(targetPath, 'application'))
  let application_index = loadFile('application/index.js')
  let application_loader = loadFile('application/loader.js')

  // 创建 base目录
  await createDirectory(path.join(targetPath, 'base'))
  let bass_class = loadFile('base/BaseClass.js')
  writeFile(path.join(targetPath, 'base/BaseClass.js'), bass_class)
  let map_class = loadFile('base/MapClass.js')
  writeFile(path.join(targetPath, 'base/MapClass.js'), map_class)

  // 创建 controller目录
  await createDirectory(path.join(targetPath, 'controller'))
  let userController = loadFile('controller/UserController.js')
  writeFile(path.join(targetPath, 'controller/UserController.js'), userController)

  // 创建 server目录
  await createDirectory(path.join(targetPath, 'service'))
  let userService = loadFile('service/UserService.js')
  writeFile(path.join(targetPath, 'service/UserService.js'), userService)

  // 创建 common目录
  await createDirectory(path.join(targetPath, 'common'))
  let log4 = loadFile('common/log4.js')
  writeFile(path.join(targetPath, 'common/log4.js'), log4)

  // 创建 extends目录
  await createDirectory(path.join(targetPath, 'extends'))
  let helper = loadFile('extends/helper.js')
  writeFile(path.join(targetPath, 'extends/helper.js'), helper)

  // 创建 middleware目录
  await createDirectory(path.join(targetPath, 'middleware'))
  let middleware = loadFile('middleware/middleware.js')
  writeFile(path.join(targetPath, 'middleware/middleware.js'), middleware)

  // 创建 routes目录
  await createDirectory(path.join(targetPath, 'routes'))
  let routes = loadFile('routes/index.js')
  writeFile(path.join(targetPath, 'routes/index.js'), routes)

  // 创建 schedule目录
  await createDirectory(path.join(targetPath, 'schedule'))
  let schedule = loadFile('schedule/schedule.js')
  writeFile(path.join(targetPath, 'schedule/schedule.js'), schedule)

  let utils_js =  loadFile('utils.js')
  writeFile(path.join(targetPath, 'utils.js'), utils_js)

  const targetPkg = {
    "name": appName,
    "version": "1.0.0",
    "description": "",
    "private": true,
    "author": "",
    "scripts": {
      "kill": "kill `lsof -t -i:8090`",
      "start": "node app.js",
      "dev": "./node_modules/.bin/nodemon app.js",
      "prd": "pm2 start app.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "dependencies": {
      "koa": "^2.7.0",
      "cross-env": "^7.0.3",
      "koa-body": "^4.1.1",
      "koa-json": "^2.0.2",
      "is-type-of": "^1.2.1",
      "koa-router": "^7.4.0",
      "koa-onerror": "^4.1.0",
      "node-schedule": "^2.1.0",
      "koa-log4": "^2.3.2",
      "koa-static": "^5.0.0",
      "koa-views": "^6.2.0",
      "koa2-cors": "^2.0.6",
      "node-cache": "^5.1.2",
    },
    "devDependencies": {
      "nodemon": "^1.19.1"
    }
  }

  const config_json = {
    "port": "8090",
    "log": {
      "rootPath": "./logs",
      "prdRootPath": ""
    }
  }

  // 创建model
  await createDirectory(path.join(targetPath, 'model'))
  if(database === 'mongodb'){
    let baseModel = loadFile('model/mongoBaseModel.js')
    let userModel = loadFile('model/mongoUserModel.js')
    writeFile(path.join(targetPath, 'model/base.js'), baseModel)
    writeFile(path.join(targetPath, 'model/user.js'), userModel)

    //
    let initModel = loadFile('js/initMongoModel.js')
    application_loader = application_loader.replace('{initModel}', eol + initModel)

    let initDatabase = loadFile('js/initMongoDb.js')
    application_loader = application_loader.replace('{initDatabase}', eol + initDatabase)
    application_loader = application_loader.replace('{exportdb}', eol + '  initModel,' + eol + '  initDataBase,')
    application_index = application_index.replace('{db}', eol + '  initModel,' + eol + '  initDataBase,')
    application_index = application_index.replace('{initdb}', eol + '    initDataBase(this)' + eol + '    initModel(this)')
    // 添加依赖
    targetPkg.dependencies["mongoose"] = "^5.7.5"

    // 添加配置项
    config_json.mongodb = {
      "servername": "localhost",
      "database": "test",
      "port": 27017,
      "user": "",
      "pass": ""
    }
  } else if (database === 'mysql') {
    let userModel = loadFile('model/mysqlUserModel.js')
    writeFile(path.join(targetPath, 'model/user.js'), userModel)

    // initModel
    let initModel = loadFile('js/initMysqlModel.js')
    application_loader = application_loader.replace('{initModel}', eol + initModel)

    let initDatabase = loadFile('js/initMysqlDb.js')
    application_loader = application_loader.replace('{initDatabase}', eol + initDatabase)
    application_loader = application_loader.replace('{exportdb}', eol + '  initModel,' + eol + '  initDataBase,')

    application_index = application_index.replace('{db}', eol + '  initModel,' + eol + '  initDataBase,')
    application_index = application_index.replace('{initdb}', eol + '    initDataBase(this)' + eol + '    initModel(this)')
    // 添加依赖
    targetPkg.dependencies["mysql2"] = "^2.3.3"
    targetPkg.dependencies["sequelize"] = "^6.19.0"
    // 添加配置项
    config_json.mysql = {
      "host": "localhost",
      "port": 3306,
      "user": "",
      "password": "",
      "database": ""
    }
  } else {
    application_loader = application_loader.replace('{initModel}', '')
    application_loader = application_loader.replace('{initDatabase}', '')
    application_loader = application_loader.replace('{exportdb}', '')
    application_index = application_index.replace('{db}', '')
    application_index = application_index.replace('{initdb}', '')
  }

  if(template === 'ejs'){
    targetPkg.dependencies["ejs"] = "^3.1.6"
    targetPkg.dependencies["koa-views"] = "^6.2.0"

    let pageController = loadFile('controller/PageController.js')
    writeFile(path.join(targetPath, 'controller/PageController.js'), pageController)

    // 创view目录
    await createDirectory(path.join(targetPath, 'views'))
    let page_view = loadFile('views/index.ejs')
    writeFile(path.join(targetPath, 'views/index.ejs'), page_view)

    // 路由
    let routes_page = loadFile('routes/page.js')
    writeFile(path.join(targetPath, 'routes/page.js'), routes_page)

    // initModel
    let initEjs = loadFile('js/ejs.js')
    initEjs = initEjs.replace('appName', appName)
    application_loader = application_loader.replace('{ejs}', initEjs)
  } else {
    application_loader = application_loader.replace('{ejs}', '')
  }

  writeFile(path.join(targetPath, 'application/loader.js'), application_loader)
  writeFile(path.join(targetPath, 'application/index.js'), application_index)
  writeFile(path.join(targetPath, 'config.json'), JSON.stringify(config_json, null, 2))
  let config_template =  loadFile('config_template.json')
  writeFile(path.join(targetPath, 'config_template.json'), config_template)
  writeFile(path.join(targetPath, 'package.json'), JSON.stringify(targetPkg, null, 2))

  // readme
  if(readme === '' || readme.toLowerCase() === 'y'){
    let readme_md =  loadFile('README.MD')
    let doc = '### ' + appName + eol + 'this is a application created by gy-koa-cli'
    writeFile(path.join(targetPath, 'README.md'), doc + eol + readme_md)
  }

  // gitignore
  if(gitignore === '' || gitignore.toLowerCase() === 'y'){
    let git_ignore =  loadFile('gitignore')
    writeFile(path.join(targetPath, '.gitignore'), git_ignore)
  }

}

async function createDirectory (path) {
  if(!path || path === ''){
    return
  }
  await mkdirp(path)
  console.log(path, chalk.green('>>>>>'),chalk.green("directory has been created"))
}

function loadFile (name) {
  return fs.readFileSync(path.join(__dirname, '..', 'app', name), 'utf-8');
}

function writeFile (filepath, str, mode = 0666) {
  fs.writeFileSync(filepath, str, { mode});
  console.log(filepath, chalk.cyan('>>>>>'),chalk.cyan("file has been written"))
}

function getFileStat(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (err) {
    return false;
  }
}
