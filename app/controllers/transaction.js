"use strict"

let obj = (rootpath) => {
    const moment = require('moment')
    const validator = require('validator')
    const fn = {}

    // START ACCOUNT
    fn.getTransaction = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let transaction_id = req.params.transaction_id || 0
            if (transaction_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('transaction').getTransaction(transaction_id)
            if (!result) {
                throw getMessage('udt004')
            }

            // validate if address belongs to loggedin customer using not found error message
            if (result.customer_id_from != customer_id || result.customer_id_to != customer_id) {
                throw getMessage('udt018')
            }

            res.success(result)
        } catch (e) {next(e)}
    }

    fn.getAllTransaction = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let where = ' AND customer_id_from = $1 OR customer_id_to = $2 '
            let data = [customer_id, customer_id]
            let order_by = ' customer_transaction_id DESC '
            let result = await req.model('transaction').getAllTransaction(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingTransaction = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let where = ' AND customer_id_from = $1 OR customer_id_to = $2 '
            let data = [customer_id, customer_id]
            let order_by = ' customer_transaction_id DESC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('transaction').getPagingTransaction(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    // END ACCOUNT

    return fn
}

module.exports = obj