"use strict"
let obj = (rootpath) => {
    const moment = require('moment')
    const fn = {}

    // BEGIN PROFILE
    fn.getProfile = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let result = await req.model('customer').getCustomer(customer_id)
            if (isEmpty(result)) {
                throw getMessage('cst007')
            }

            // don't show the password when get profile
            delete result.customer_password

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateProfile = async (req, res, next) => {
        try {
            let validator = require('validator')
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }


            // Validate customername length
            let name = (req.body.customer_name || '').trim()
            let email = (req.body.email || '').trim().toLowerCase()
            let phone = (req.body.phone || '').trim()            
            let id_number = (req.body.id_number || '').trim()    

            if (!loadLib('validation').validName(name)) {
                throw getMessage('cst018')
            }

            let detailCustomer = await req.model('customer').getCustomer(customer_id)
            if (isEmpty(detailCustomer)) {
                throw getMessage('cst007')
            }

            let data = {
                customer_name: name || detailCustomer.customer_name,
                customer_email: email || detailCustomer.customer_email,
                customer_phone: phone || detailCustomer.customer_phone,
                customer_identification_id: id_number || detailCustomer.customer_identification_id,
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // validate name
            if (validator.isEmpty(data.customer_name)) {
                throw getMessage('cst002')
            }
            // validate email
            if (validator.isEmpty(data.customer_email)) {
                throw getMessage('cst003')
            }
            // validate email format
            if (!loadLib('validation').isValidEmail(data.customer_email)) {
                throw getMessage('cst004')
            }
            // validate if email exists and not belong to logged in customer
            let dupEmail = await req.model('customer').getCustomerEmail(data.customer_email)
            if (dupEmail && dupEmail.customer_id !== customer_id) {
                throw getMessage('cst005')
            }

            // insert data & get detail
            await req.model('customer').updateCustomer(customer_id, data)
            let result = await req.model('customer').getCustomer(customer_id)

            // don't show password
            delete result.customer_password

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    // BEGIN SAVED ACCOUNT
    fn.getSavedAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let account_number = req.params.account_number || ''
            if (validator.isEmpty(account_number)) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('directory').getSavedAccount(account_number)
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

    fn.getAllSavedAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND customer_account_directory_deleted = $1 AND customer_account_directory_deleted LIKE $2 '
            let data = [false, keyword]
            let order_by = ' customer_account_directory_id DESC '
            let result = await req.model('directory').getAllSavedAccount(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingSavedAccount = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND customer_account_directory_deleted = $1 AND customer_account_directory_deleted LIKE $2 '
            let data = [false, keyword]
            let order_by = ' customer_account_directory_id DESC  '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('directory').getPagingSavedAccount(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createSavedAccount = async (req, res, next) => {
        try {
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let number = (req.body.account_number || '').trim()

            // get the account number detail

            // if not exist then throw error

            // if exist then check if the customer_id equal

            // if equal then can't store the account number, throw error

            // if not equal then store the account detail
            let result = await req.model('directory').getSavedAccount(customer_account.customer_account_id)
            res.success(result)   
        } catch(e) {next(e)}
    }
    // END SAVED ACCOUNT
    return fn
}

module.exports = obj