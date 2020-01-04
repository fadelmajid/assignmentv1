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
const ovoConfig = config.ovo

// logger
const myLogger = require(rootpath + '/core/logger.js')("../logs/cron-ovo.log", 'cronovo', 50000000, 10, 'trace');

// load moment
let moment = require('moment')

// load forge
let forge = require('node-forge')
forge.options.usePureJavaScript = true;

// load request
let request = require('request-promise');
let objDB = require(rootpath + "/core/database.js")(rootpath)
let objSource = {}

myLogger.info('start', 'cron has started')

objSource.run = async () => {
    let db = await objDB.getConnection()
    let userModel = require(rootpath + '/app/models/user.js')(objDB, db, rootpath)
    let orderModel = require(rootpath + '/app/models/order.js')(objDB, db, rootpath)
    let paymentModel = require(rootpath + '/app/models/payment.js')(objDB, db, rootpath)
    let ovoModel = require(rootpath + '/app/models/ovo.js')(objDB, db, rootpath)
    let emoneyModel = require(rootpath + '/app/models/emoney.js')(objDB, db, rootpath)

    let now = moment().format('YYYY-MM-DD HH:mm:ss')
    let execute = moment().add(15, 'seconds').format('YYYY-MM-DD HH:mm:ss')
    let today = moment().format('YYYY-MM-DD')

    let where = " AND pyhis.pymtd_id = ? AND pyhis.pyhis_status = ? "
    let pendingOVO = await orderModel.getAllOrderPayment(where, [cst.id_payment_ovo, cst.payment_pending], " pyhis_id ASC ", 1)
    if(pendingOVO.length > 0) {
        let detailOVO = pendingOVO[0]
        let userDetail = await userModel.getUser(detailOVO.user_id)

        if(userDetail) {
            //update status waiting for payment uor payment
            let py_status = await orderModel.updateOrderPayment(detailOVO.pyhis_id, {"pyhis_status":cst.payment_waiting, "updated_date": now})
            // logging into file
            let log_pystatus = {
                "pyhis_id": detailOVO.pyhis_id,
                "pyhis_status": cst.payment_waiting,
                "response": py_status
            }
            myLogger.trace('update_user_order_payment', JSON.stringify(log_pystatus))

            //call ovo counter to get refno and batchno
            let counter = await ovoModel.getOvoCounterDate(today)
            let ctr_id = ""
            let ctrdata = ""
            let data = {}
            if(counter) { // if counter (refno, batchno) today already exist
                data = {
                    "ref_no": counter.ref_no + 1,
                    "batch_no": counter.batch_no,
                    "ovotr_date": today,
                    "created_Date": now
                }
                ctr_id = await ovoModel.insertOvoCounter(data)
            }else{ // if counter today doesnt exist
                // get latest batch (max)
                ctrdata = await ovoModel.getMaxBatchNo()
                if(ctrdata.max_no) { // if latest / max batch number exist
                    data = {
                        "ref_no": 1,
                        "batch_no": ctrdata.max_no + 1,
                        "ovotr_date": today,
                        "created_date": now
                    }
                    ctr_id = await ovoModel.insertOvoCounter(data)
                }else{ // if batch number doesnt exist, create as new (1)
                    data = {
                        "ref_no": 1,
                        "batch_no": 1,
                        "ovotr_date": today,
                        "created_date": now
                    }
                    ctr_id = await ovoModel.insertOvoCounter(data)
                }
            }
            // logging into file
            let logCounter = {
                "ctr_id": ctr_id,
                "data": data
            }
            myLogger.trace('insert_ovo_counter', JSON.stringify(logCounter))

            let ctr_data = await ovoModel.getOvoCounter(ctr_id)
            // logging into file
            myLogger.trace('get_ovo_counter_data', JSON.stringify(ctr_data))

            // get number from table emoney
            let emoney = await emoneyModel.getEmoneyUser(detailOVO.user_id, cst.id_payment_ovo)

            //set ovo data
            let ovoData = {
                "amount": detailOVO.uor_total,
                "referenceNumber" : ctr_data.ref_no,
                "batchNo" : ctr_data.batch_no,
                "user_phone" : emoney.emy_number,
                "merchantInvoice" : detailOVO.uor_code
            }
            // set request data
            let reqData = await objSource.setRequestData(ovoData)
            // logging into file
            myLogger.trace('ovo_request', JSON.stringify(reqData))

            // update user order payment, pyhis_data
            let pyhis_data = {
                "ref_no": ctr_data.ref_no,
                "batch_no": ctr_data.batch_no,
                "number": emoney.emy_number
            }
            let pyhis_res = await orderModel.updateOrderPayment(detailOVO.pyhis_id, {"pyhis_data":JSON.stringify(pyhis_data), "updated_date": now})
            // logging into file
            let log_pyhisdata = {
                "pyhis_id" : detailOVO.pyhis_id,
                "pyhis_data": pyhis_data,
                "response": pyhis_res
            }
            myLogger.trace('update_user_order_payment', JSON.stringify(log_pyhisdata))

            // hit ovo api
            let requestOvo = await objSource.ovoRequest(reqData)
            // logging into file
            myLogger.trace('ovo_response', JSON.stringify(requestOvo))

            // set data to insert payment logs
            let logData = {
                "pymtd_id": detailOVO.pymtd_id,
                "pyhis_id": detailOVO.pyhis_id,
                "uor_id": detailOVO.uor_id,
                "pylog_type": "P2P",
                "pylog_endpoint": ovoConfig.url,
                "pylog_header": JSON.stringify(ovoConfig.headers),
                "pylog_request": JSON.stringify(reqData),
                "pylog_response": JSON.stringify(requestOvo),
                "created_date": now
            }
            // insert into logs
            let logs_id = await paymentModel.insertPaymentLogs(logData)
            // logging into file
            let logPay = {
                "logs_id": logs_id,
                "data": logData
            }
            myLogger.trace('insert_payment_logs', JSON.stringify(logPay))

            // check status code & response code
            let pyhis_status = cst.payment_cancel
            let uor_status = cst.ord_cancelled
            let ovo_response_code = ""
            let ovo_remarks = ""
            if(requestOvo.body.response.body !== undefined) {
                ovo_response_code = requestOvo.body.response.body.responseCode || ""
            }
            if(requestOvo.statusCode == 200 && ovo_response_code == cst.ovo_success_code) {
                pyhis_status = cst.payment_paid
                uor_status = cst.ord_paid
                ovo_remarks = "00"
            }else{
                ovo_remarks = ovo_response_code
            }
            if(ovo_response_code == "") {
                let revData = {
                    "uor_id": detailOVO.uor_id,
                    "pyhis_id": detailOVO.pyhis_id,
                    "ovorev_refno": ctr_data.ref_no,
                    "ovorev_batchno": ctr_data.batch_no,
                    "ovorev_status": cst.ovorev_pending,
                    "ovorev_counter": 1,
                    "ovorev_nextexe": execute,
                    "created_date": now
                }
                // insert into ovo reversal
                let ref_id = await ovoModel.insertOvoReversal(revData)
                // logging into file
                let ref_data = {
                    "ref_id" : ref_id,
                    "data": revData
                }
                myLogger.trace('insert_ovo_reversal', JSON.stringify(ref_data))
            }
            if(ovo_remarks == "") {
                ovo_remarks = "01"
            }

            let updateData = {
                "pyhis_status": pyhis_status,
                "updated_date": now
            }
            // update data user order payment
            let uor_pay = await orderModel.updateOrderPayment(detailOVO.pyhis_id, updateData)
            // logging into file
            let log_uorpay = {
                "pyhis_id": detailOVO.pyhis_id,
                "pyhis_status": pyhis_status,
                "response": uor_pay
            }
            myLogger.trace('update_user_order_payment', JSON.stringify(log_uorpay))

            let uor_remarks = objSource.getMessage('ovo0'.concat(ovo_remarks)).en
            let orderData = {
                "uor_status": uor_status,
                "uor_remarks": uor_remarks,
                "updated_by": 0,
                "updated_date": now
            }
            // update data user order
            let uor_stat = await orderModel.updateOrder(detailOVO.uor_id, orderData)
            // logging into file
            let log_orderdata = {
                "uor_id": detailOVO.uor_id,
                "uor_status": uor_status,
                "response": uor_stat
            }
            myLogger.trace('update_user_order', JSON.stringify(log_orderdata))
        }else{
            //logging into file
            myLogger.trace('invalid_user', JSON.stringify(detailOVO))
        }
    }
    db.release()
}

objSource.setRequestData = async (data) => {
    // load moment js
    let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    let timestamp = moment().format('x')
    timestamp = Math.floor(timestamp / 1000)

    // create hmac
    let hmac = forge.hmac.create()
    hmac.start('sha256', ovoConfig.headers.app_key)
    hmac.update(ovoConfig.headers.app_id.concat(timestamp))
    let code = hmac.digest().toHex()

    // clean phone
    let phone = data.user_phone
    let clean_phone = phone.replace(/[^0-9]+/g, "")
    clean_phone = "62" == clean_phone.slice(0, 2) ? "0" + clean_phone.substring(2) : clean_phone

    // set request data
    let options = {
        method: 'post',
        url: ovoConfig.url,
        headers: {
            "Content-Type": "application/json",
            "app-id": ovoConfig.headers.app_id,
            "random": timestamp,
            "hmac": code,
        },
        timeout: cst.ovo_timeout,
        body: {
            "type": "0200",
            "processingCode": "040000",
            "amount": data.amount,
            "date": now,
            "referenceNumber": data.referenceNumber,
            "tid": ovoConfig.body.TID,
            "mid": ovoConfig.body.MID,
            "merchantId": ovoConfig.body.merchant_id,
            "storeCode": ovoConfig.body.store_code,
            "appSource": "POS",
            "transactionRequestData": {
                "batchNo": data.batchNo,
                "merchantInvoice": data.merchantInvoice,
                "phone": clean_phone
            }
        },
        json: true
    }

    return options
}

objSource.getMessage = (code, replacement) => {
    //copy & paste "en" language to another lang if you want to activate multiple language
    let langEn = require(path.normalize(rootpath + '/app/lang/en.json'))
    let objMessage = {
        "code": code,
        "en": code
    }
    let msg = langEn.filter((row) => row[code] !== undefined).map((row) => row[code]).toString()

    // replace with regex
    if(typeof replacement === 'string') {
        msg = msg.replace(/%s/ig, replacement)
    }else if(typeof replacement === 'object') {
        for(let i = 0, len = replacement.length; i < len; i++) {
            msg = msg.replace(/%s/i, replacement[i])
        }
    }

    // return object
    objMessage.en = msg != '' ? msg : code
    return objMessage
}

objSource.ovoRequest = async (data) => {
    let response = {}
    try{
        let reqovo = await request(data)
        myLogger.debug('ovoRequest_try', JSON.stringify(reqovo))
        response = {
            "statusCode": 200,
            "body": reqovo
        }
        return response
    }catch(err) {
        myLogger.debug('ovoRequest_catch', JSON.stringify(err.response))
        response = {
            "statusCode": 500,
            "body": err
        }
        return response
    }
}

//variabel penampung hasil hit
/*
    {
        {
            // ========= request ========= //
            "transactionResponseData": {
                "storeAddress1": "Kempinsky",
                "ovoid": "********8094",
                "cashUsed": "20000",
                "storeAddress2": "Hotel Indonesia ",
                "ovoPointsEarned": "0",
                "cashBalance": "1934970",
                "fullName": "Dikha Rahardian Putra",
                "storeName": "BookMyShowJKT",
                "ovoPointsUsed": "0",
                "ovoPointsBalance": "4543500",
                "storeCode": "BookMyShow2018",
                "paymentType": "PUSH TO PAY"
            }
        }
    }
*/

cronScript({
    infinite_loop: true,
    pid_file: "../pid/cron_ovo.pid",
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