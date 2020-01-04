"use strict"

const path = require("path")
let rootpath = path.resolve(__dirname, "../")
let cronpath = rootpath + '/cronjob'

require("dotenv").config({path: rootpath + '/.env'})
global.ENV = process.env.NODE_ENV || 'development';

////to enable debug, .env must be load first than oneScript
const cronScript = require(cronpath + "/src/index.js")
const xenditScript = require(cronpath + "/src/xendit.js")(rootpath)

//logger
global.myLogger = require(rootpath + '/core/logger.js')("../logs/cron-xendit.log", 'cronxendit', 50000000, 10, 'trace');

// set global lib function on framework request object
global.loadLib = (filename) => require(path.normalize(rootpath + '/app/libs/' + filename.toLowerCase() + '.js'))(rootpath)

let objSource = {}

myLogger.info('start', 'cron has started')

objSource.run = async () => {
    await xenditScript.cron(1)
}

cronScript({
    infinite_loop: true,
    pid_file: "../pid/cron_xendit.pid",
    source: objSource,
    sleep: 1000,
    run: 'run',
    init: false,
    close: false
}).then(() => {
    //logging into file
    myLogger.info('stop', 'cron has stopped')
    process.exit(0);
}).catch((err) => {
    //logging into file
    myLogger.error('catch', JSON.stringify(err))
    process.exit(0);
})