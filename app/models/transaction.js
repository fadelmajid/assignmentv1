'use strict'

let obj = (objDB, db, rootpath) => {
    const tbl = require(rootpath + "/config/tables.json")
    const fn = {}

    fn.insertTransaction = async (data) => {
        let res = await objDB.insert(db, tbl.customer_transaction, data, "customer_transaction_id")
        return res
    }

    return fn
}

module.exports = obj
