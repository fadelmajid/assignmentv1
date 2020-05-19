'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const fn = {}

    // BEGIN USER
    fn.getRequest = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.request_loan + " WHERE reqloan_id = $1 LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.count = async (data) => {
        // prepare sql query
        let sql = "SELECT COUNT(*) FROM " + tbl.request_loan + " WHERE created_date >= $1 AND created_date < $2"

        let rows = await db.query(sql, data)
        return rows.rows[0]
    }

    fn.getLastRequest = async () => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.request_loan + " ORDER BY created_date DESC LIMIT 1"

        let rows = await db.query(sql, [])
        return rows.rows[0]
    }

    fn.getAllRequest = async (where = '', data = [], order_by = 'created_date ASC', limit = 0) => {
        let sql = "SELECT * FROM " + tbl.request_loan + " WHERE 1=1 " + where + " ORDER BY " + order_by
        console.log(sql)
        let result = await objDB.getAll(db, sql, data, limit)
        console.log(result)
        return result
    }

    fn.insertRequest = async (data) => {
        let res = await objDB.insert(db, tbl.request_loan, data, "reqloan_id")
        return res
    }
    // END USER
    return fn
}

module.exports = obj