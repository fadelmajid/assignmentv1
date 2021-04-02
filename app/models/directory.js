'use strict'
let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + '/config/tables.json')
    const fn = {}

    // START ACCOUNT
    fn.insertSavedAccount = async (data) => {
        let res = await objDB.insert(db, tbl.customer_account_directory, data, "customer_account_directory_id")
        return res
    }

    fn.getSavedAccount = async (id) => {
        // prepare sql query
        let sql = "SELECT * FROM " + tbl.customer_account_directory + " WHERE customer_account_directory_id = $1 LIMIT 1"

        let rows = await db.query(sql, [id])
        return rows.rows[0]
    }

    fn.getAllSavedAccount = async (where = '', data = [], order_by = " customer_account_directory_id ASC ", limit = 0) => {
        let sql = "SELECT * FROM " + tbl.customer_account_directory + " WHERE 1=1 " + where + " ORDER BY " + order_by

        let result = await objDB.getAll(db, sql, data, limit)
        return result
    }

    fn.getPagingSavedAccount = async (where = '', data = [], order_by = " customer_account_directory_id ASC ", page_no = 0, no_per_page = 0) => {
        let paging = loadLib('sanitize').pagingNumber(page_no, no_per_page)
        let sql = "SELECT customer_account_directory.* FROM " + tbl.customer_account_directory + " WHERE 1=1 " + where + " ORDER BY " + order_by
        let result = await objDB.getPaging(db, sql, data, paging.page_no, paging.no_per_page)
        return result
    }
    // END ACCOUNT
    return fn
}

module.exports = obj
