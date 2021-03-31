'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const fn = {}

    // BEGIN CUSTOMER
    fn.getConstant = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.constant + " WHERE const_id = $1 LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.getLastConstant = async () => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.constant + " ORDER BY created_date DESC LIMIT 1"

        let rows = await db.query(sql, [])
        return rows.rows[0]
    }

    fn.insertConstant = async (data) => {
        let res = await objDB.insert(db, tbl.constant, data, "const_id")
        return res
    }
    // END CUSTOMER
    return fn
}

module.exports = obj
