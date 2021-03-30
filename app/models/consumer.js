'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const cst = require(rootpath + '/config/const.json')
    const config = require(rootpath + "/config/config.json")
    const fn = {}
    let moment = require('moment')
    const crypto = require('crypto')

    // BEGIN USER
    fn.getUser = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.consumer + " WHERE consumer_id = $1 LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.getUserEmail = async (email) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.consumer + " WHERE consumer_email = $1 LIMIT 1"

        let row = await db.query(sql, [email])
        return row.rows[0]
    }

    fn.getUserPhone = async (phone) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.consumer + " WHERE consumer_phone = $1 ORDER BY consumer_id DESC LIMIT 1"

        let rows = await db.query(sql, [phone])
        return rows.rows[0]
    }

    fn.getUserCode = async (code) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.consumer + " WHERE consumer_code = $1 LIMIT 1"

        let rows = await db.query(sql, [code])
        return rows.rows[0]
    }

    fn.getAllUser = async (where = '', data = [], order_by = " consumer_id ASC ", limit = 0) => {
        let sql = "SELECT * FROM " + tbl.consumer + " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.insertUser = async (data) => {
        let res = await objDB.insert(db, tbl.consumer, data, "consumer_id")
        return res
    }

    fn.updateUser = async (id, data) => {
        let where = {'cond': 'consumer_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.consumer, where, data)
    }

    fn.uploadImage = async (id, data) => {
        let where = {'cond': 'consumer_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.consumer, where, data)
    }

    fn.generateRefCode = (string) => {
        let moment = require('moment')
        const crypto = require('crypto')
        // notes : function untuk generate referral code per user
        const mili = moment().millisecond()
        const rstr = '_' + Math.random().toString(36).substr(2, 9)
        let unique = crypto.createHash('sha256').update(mili + string + rstr).digest("hex")
        return unique.substr(2, 6).toUpperCase()
    }

    fn.getUniqueCode = async (string) => {
        // generate & validate unik access token
        let referral_code = fn.generateRefCode(string)
        return referral_code
    }
    // END USER

    // START DATA
    fn.insertUserData = async (data) => {
        let res = await objDB.insert(db, tbl.consumer_data, data, "consumer_data_id")
        return res
    }

    fn.getUserData = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.consumer_data + " WHERE consumer_data_id = $1 AND is_deleted = false LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.updateUserData = async (id, data) => {
        let where = {'cond': 'consumer_data_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.consumer_data, where, data)
    }

    fn.deleteSoftUserData = async (id, data) => {
        let where = {'cond': 'consumer_data_id = $1', 'bind': [id]}
        return await objDB.update(db, tbl.consumer_data, where, data)
    }

    fn.deleteUserData = async (id) => {
        let where = {"cond": "consumer_data_id = $1", "bind": [id]}
        return await objDB.delete(db, tbl.consumer_data, where)
    }

    fn.getAllUserData = async (where = '', data = [], order_by = " consumer_data_id ASC ", limit = 0) => {
        let sql = "SELECT * FROM " + tbl.consumer_data + " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.getPagingUserData = async (where = '', data = [], order_by = " consumer_data_id ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = "SELECT consumer_data.* FROM " + tbl.consumer_data + " WHERE 1=1 " + where + " ORDER BY " + order_by
        let result = await objDB.getPaging(db, sql, data, paging.page_no, paging.no_per_page)
        return result
    }
    // END DATA

    // BEGIN REGISTRATION
    fn.registration = async (data) => {
        let moment = require('moment')
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const authModel = require('./auth.js')(objDB, db, rootpath)
        const ltModel = require('./lock_transaction.js')(objDB, db, rootpath)
        const {name, email, phone, id_number, birthday, province, password, objToken} = data
        //BEGIN TRANSACTION
        await db.query('BEGIN')
        try{
            // create lock_transaction data
            await ltModel.insertRegister('Insert new user, name ' + name + ', email ' + email + ', phone' + phone + ', birthday' + birthday + ', province' + province)

            let data = {
                "consumer_name": name,
                "consumer_code": await fn.getUniqueCode(email),
                "consumer_email": email,
                "consumer_phone": phone,
                "consumer_identification_id": id_number,
                "consumer_province": province,
                "consumer_birthday": birthday,
                "consumer_password": password,
                "consumer_status": "active",
                "last_login": now,
                "created_date": now
            }
            let consumer_id = await fn.insertUser(data)
            let detailUser = await fn.getUser(consumer_id.consumer_id)

            // update column consumer_id in auth_token
            data = {
                "consumer_id": detailUser.consumer_id,
                "updated_date": now
            }
            await authModel.updateToken(objToken.atoken_id, data)

            //double validation, karena sering terjadi race condition
            let allUsers = await fn.getAllUser(" AND consumer_phone = $1 ", [phone])

            if(allUsers.length > 1) {
                throw getMessage('auth016')
            }

            //COMMIT
            await db.query('COMMIT')

            return detailUser
        }catch(e) {
            //ROLLBACK
            await db.query('ROLLBACK')
            throw e
        }
    }
    // END REGISTRATION

    //BEGIN LOGIN
    fn.login = async (data) => {
        let moment = require('moment')
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        const authModel = require('./auth.js')(objDB, db, rootpath)
        const ltModel = require('./lock_transaction.js')(objDB, db, rootpath)
        const {detailUser, objToken} = data

        //BEGIN TRANSACTION
        await db.query('BEGIN')
        try{
            // create lock_transaction data
            await ltModel.insertLogin('Insert new user, name ' + detailUser.consumer_name + ', email ' + detailUser.consumer_email + ', phone' + detailUser.consumer_phone)

            // update column consumer_id in auth_token
            let tokenData = {
                "consumer_id": detailUser.consumer_id,
                "updated_date": now
            }
            await authModel.updateToken(objToken.atoken_id, tokenData)

            //INSERT IGNORE HISTORY TOKEN
            let insData = {
                "atoken_device": objToken.atoken_device,
                "atoken_platform": objToken.atoken_platform,
                "created_date": now
            }
            await authModel.insertHistoryToken(insData)
            // update last login
            await fn.updateUser(detailUser.consumer_id, {"last_login": now})

            //COMMIT
            await db.query('COMMIT')

            return true
        }catch(e) {
            //ROLLBACK
            await db.query('ROLLBACK')
            return false//return false supaya muncul pesan error general auth022
        }
    }
    //END LOGIN
    return fn
}

module.exports = obj
