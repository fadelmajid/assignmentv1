'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const fn = {}

    // BEGIN USER
    fn.getRequest = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.request + " WHERE reqloan_id = $1 LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.count = async (data) => {
        // prepare sql query
        let sql = "SELECT COUNT(*) FROM " + tbl.request + " WHERE created_date >= $1 AND created_date < $2"

        let rows = await db.query(sql, data)
        return rows.rows[0]
    }

    fn.getLastRequest = async () => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.request + " ORDER BY created_date DESC LIMIT 1"

        let rows = await db.query(sql, [])
        return rows.rows[0]
    }

    fn.getAllRequest = async (where = '', data = [], order_by = 'created_date ASC', limit = 0) => {
        let sql = "SELECT * FROM " + tbl.request + " WHERE 1=1 " + where + " ORDER BY " + order_by
        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.insertRequest = async (data) => {
        let res = await objDB.insert(db, tbl.request, data, "reqloan_id")
        return res
    }
    // END USER
    return fn
}

module.exports = obj
