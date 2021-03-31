"use strict"

let obj = (rootpath) => {
    const moment = require('moment')
    const validator = require('validator')
    const fn = {}

    // START ACCOUNT
    fn.getAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let account = req.params.account_number || ''
            if (validator.isEmpty(account)) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('account').getAccountByNumber(account)
            if (!result) {
                throw getMessage('udt004')
            }
            // validate if address belongs to loggedin customer using not found error message
            if (result.customer_id != customer_id) {
                throw getMessage('udt004')
            }

            res.success(result)
        } catch (e) {next(e)}
    }

    fn.getAllAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND customer_account_status = $1 AND customer_id = $2 AND (customer_account_name LIKE $3 OR customer_account_number LIKE $4) '
            let data = ['active', customer_id, keyword, keyword]
            let order_by = ' customer_account_id ASC '
            let result = await req.model('account').getAllAccount(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND customer_account_status = $1 AND customer_id = $2 AND (customer_account_name LIKE $3 OR customer_account_number LIKE $4) '
            let data = ['active', customer_id, keyword, keyword]
            let order_by = ' customer_account_id ASC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('account').getPagingAccount(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createAccount = async (req, res, next) => {
        try {
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            // get parameter
            let name = (req.body.account_name || '').trim()
            let number = (req.body.account_number || '').trim()

            // Start Validate required
            if (validator.isEmpty(name)) {
                throw getMessage('udt001')
            }

            if (validator.isEmpty(number)) {
                throw getMessage('udt002')
            }

            // set variable to insert
            let data = {
                customer_id : customer_id,
                customer_account_name : name,
                customer_account_number : number,
                created_date : now
            }

            let customer_account_id = await req.model('account').insertAccount(data)
            let result = await req.model('account').getAccount(customer_account_id.customer_account_id)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let account_number = req.params.account_number || ''
            if (account_number <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let account = await req.model('account').getAccountByNumber(account_number)
            if (!account) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin customer
            if (account.customer_id != customer_id) {
                throw getMessage('udt005')
            }

            let data = {
                customer_account_name: (req.body.customer_account_name || '').trim(),
                customer_account_status: (req.body.customer_account_status || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            console.log(account)

            await req.model('account').updateAccount(account.customer_account_id, data)
            let result = await req.model('account').getAccount(customer_account_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.topupAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let customer_account_id = parseInt(req.params.customer_account_id) || 0
            if (customer_account_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let account = await req.model('account').getAccount(customer_account_id)
            if (!account) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin customer
            if (account.customer_id != customer_id) {
                throw getMessage('udt005')
            }

            let data = {
                customer_account_number: (req.body.account || '').trim(),
                customer_account_name: (req.body.customername || '').trim(),
                customer_account_password: (req.body.password || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('account').updateAccount(customer_account_id, data)
            let result = await req.model('account').getAccount(customer_account_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.transfer = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let customer_account_id = parseInt(req.params.customer_account_id) || 0
            if (customer_account_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let account = await req.model('account').getAccount(customer_account_id)
            if (!account) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin customer
            if (account.customer_id != customer_id) {
                throw getMessage('udt005')
            }

            let data = {
                customer_account_number: (req.body.account || '').trim(),
                customer_account_name: (req.body.customername || '').trim(),
                customer_account_password: (req.body.password || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('account').updateAccount(customer_account_id, data)
            let result = await req.model('account').getAccount(customer_account_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    // END ACCOUNT

    return fn
}

module.exports = obj