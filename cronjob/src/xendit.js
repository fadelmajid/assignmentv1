'use strict'

let obj = (rootpath) => {
    const cst = require(rootpath + '/config/const.json')
    const fn = {}

    //load moment
    let moment = require('moment')

    let objDB = require(rootpath + "/core/database.js")(rootpath)

    fn.cron = async (bank_id) => {
        let db = await objDB.getConnection()
        let userModel = require(rootpath + '/app/models/user.js')(objDB, db, rootpath)

        let where = " AND uva_status = ? AND uva_provider = 'xendit' AND uva_account_number IS NULL AND user_va.bank_id = ? "
        let pendingVA = await userModel.getAllVA(where, [cst.uva_pending, bank_id], " uva_id ASC ", 1)
        if(pendingVA.length > 0) {
            let detailVA = pendingVA[0]

            let userDetail = await userModel.getUser(detailVA.user_id)
            if(userDetail) {
                //set xendit data
                let xenditData = loadLib('xendit').xenditData(detailVA.bank_code)
                if(detailVA.bank_code == cst.xendit_va_bca) {
                    xenditData = loadLib('xendit').xenditData_custom_phone(detailVA.bank_code, '', userDetail.user_name, userDetail.user_phone)
                }

                myLogger.trace('xendit_data', JSON.stringify(xenditData))
                //hit xendit api
                let requestXendit = await loadLib('xendit').xenditRequest(xenditData)
                //set status
                let status = requestXendit.statusCode == 200 ? requestXendit.body.status.toLowerCase() : cst.uva_error
                let uva_status = status == cst.uva_pending ? cst.uva_pending : status == cst.uva_active ? cst.uva_active : cst.uva_error

                let updateData = {
                    "uva_account_name": requestXendit.statusCode == 200 ? requestXendit.body.name : null,
                    "uva_account_number": requestXendit.statusCode == 200 ? requestXendit.body.account_number : null,
                    "uva_status": uva_status,
                    "uva_response": JSON.stringify(requestXendit),
                    "updated_date": moment().format('YYYY-MM-DD HH:mm:ss')
                }

                //update data VA
                await userModel.updateVA(detailVA.uva_id, updateData)

                //logging into file
                myLogger.debug('xendit_response', JSON.stringify(requestXendit))
            }else{
                //logging into file
                myLogger.debug('invalid_user', JSON.stringify(detailVA))
            }
        }

        db.release()
    }

    return fn
}

module.exports = obj