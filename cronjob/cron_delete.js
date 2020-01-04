"use strict"

const path = require("path")
let rootpath = path.resolve(__dirname, "../")
let cronpath = rootpath + '/cronjob'

require("dotenv").config({path: rootpath + '/.env'})
global.ENV = process.env.NODE_ENV || 'development';

// to enable debug, .env must be load first than oneScript
const cronScript = require(cronpath + "/src/index.js")
const config = require(rootpath + '/config/config.json')
const cst = require(rootpath + '/config/const.json')

// logger
const myLogger = require(rootpath + '/core/logger.js')("../logs/cron_delete.log", 'cron_delete', 50000000, 10, 'trace');

// load moment
let moment = require('moment')

// load forge
let forge = require('node-forge')
forge.options.usePureJavaScript = true;

// load request
let objDB = require(rootpath + "/core/database.js")(rootpath)
let objSource = {}
let now = moment().format('YYYY-MM-DD HH:mm:ss')

myLogger.info('start', 'cron has started')

objSource.run = async () => {
    let db = await objDB.getConnection()
    let userModel = require(rootpath + '/app/models/user.js')(objDB, db, rootpath)

    let where = " AND is_deleted = $1 AND DATE_PART('day', $2 - updated_date) >= $3 "
    let data = [true, now, 3]
    let pendingDel = await userModel.getAllUserData(where, data, " udata_id ASC ", 1)
    
    if(pendingDel.length > 0){
        let detail = pendingDel[0]
        
        // if already three days on is_deleted == true
        let userDetail = await userModel.getUser(detail.user_id)
        if(userDetail){
            // logging into file
            myLogger.trace('user_data : ', JSON.stringify(detail))

            // logging into db
            // let log_data = {
            //     user_id : userDetail.user_id,
            //     log_type : 'user data',
            //     log_json : JSON.stringify(detail)
            // }
            // await userModel.insertLog(log_data)

            // delete permanent
            await userModel.deleteUserData(detail.udata_id)
        }else{
            // logging into file
            myLogger.trace('invalid_user : ', JSON.stringify(detail))
        }
    }

    db.release()
}

cronScript({
    infinite_loop: true,
    pid_file: "../pid/cron_delete.pid",
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