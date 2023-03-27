# gy-koa-cli
a generator for koa application

[![NPM Version](https:///img.shields.io/npm/v/gy-koa-cli.svg)](https://www.npmjs.com/package/gy-koa-cli)

## Installation

```sh
$ npm install -g gy-koa-cli
```

## Quick Start

create application

```bash
$ gy-koa

# create app at current directory
$ gy-koa your-app-name 

# also create by full path
$ gy-koa /usr/local/your-app-name 
```

start application

```
cd {your project path}
```

```
npm run start
```

## Final Project's Directory 
```
├─ application                       
    ├─ index.js                      
    ├─ loader.js           
├─ base                       
    ├─ BaseClass.js                      
    ├─ MapClass.js
├─ common                       
    ├─ log4.js
├─ controller                       
    ├─ UserController.js                      
    ├─ ...
├─ extends                     
    ├─ helper.js
├─ extends                     
    ├─ helper.js
├─ middleware                     
    ├─ middleware.js    
├─ node_modules       
├─ model                    
    ├─ user.js 
    ├─ ...                  
├─ routes                     
    ├─ index.js
    ├─ ...
├─ schedule                     
    ├─ shcedule.js   
├─ service                     
    ├─ UserService.js    
├─ views                     
    ├─ ...
├─ app.js
├─ config.json
├─ config_template.json
├─ package.json
├─ utils.js       
```

## Options

### database
* mongodb
* mysql
* no-database

### template engine

* ejs
* no-engine

### need .gitignore ?

* Y
* N

### need README.MD ?

* Y
* N
## License

[MIT](LICENSE)
