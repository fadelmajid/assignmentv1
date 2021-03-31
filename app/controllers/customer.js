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
            if (!loadLib('validation').validName(name)) {
                throw getMessage('cst018')
            }

            let detailCustomer = await req.model('customer').getCustomer(customer_id)
            if (isEmpty(detailCustomer)) {
                throw getMessage('cst007')
            }

            let data = {
                customer_name: name,
                customer_email: (req.body.customer_email || '').toLowerCase() || '',
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

    // START DATA
    fn.getCustomerData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let udata = parseInt(req.params.customer_data_id) || 0
            if (udata <= 0) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('customer').getCustomerData(udata)
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

    fn.getAllCustomerData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND customer_id = $2 AND (customer_data_customername LIKE $3 OR customer_data_account LIKE $4) '
            let data = [false, customer_id, keyword, keyword]
            let order_by = ' customer_data_id ASC '
            let result = await req.model('customer').getAllCustomerData(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingCustomerData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND customer_id = $2 AND (customer_data_customername LIKE $3 OR customer_data_account LIKE $4) '
            let data = [false, customer_id, keyword, keyword]
            let order_by = ' customer_data_id ASC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('customer').getPagingCustomerData(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createCustomerData = async (req, res, next) => {
        try {
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }

            // get parameter
            let account = (req.body.account || '').trim()
            let customername = (req.body.customername || '').trim()
            let password = (req.body.password || '')

            // Start Validate required
            if (validator.isEmpty(account)) {
                throw getMessage('udt001')
            }

            if (validator.isEmpty(customername)) {
                throw getMessage('udt002')
            }

            if (validator.isEmpty(password)) {
                throw getMessage('udt003')
            }

            // set variable to insert
            let data = {
                customer_id : customer_id,
                customer_data_account : account,
                customer_data_customername : customername,
                customer_data_password : password,
                created_date : now
            }

            let customer_data_id = await req.model('customer').insertCustomerData(data)
            let result = await req.model('customer').getCustomerData(customer_data_id.customer_data_id)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateCustomerData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let customer_data_id = parseInt(req.params.customer_data_id) || 0
            if (customer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let customerdata = await req.model('customer').getCustomerData(customer_data_id)
            if (!customerdata) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin customer
            if (customerdata.customer_id != customer_id) {
                throw getMessage('udt005')
            }

            let data = {
                customer_data_account: (req.body.account || '').trim(),
                customer_data_customername: (req.body.customername || '').trim(),
                customer_data_password: (req.body.password || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('customer').updateCustomerData(customer_data_id, data)
            let result = await req.model('customer').getCustomerData(customer_data_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.deleteCustomerData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let customer_data_id = parseInt(req.params.customer_data_id) || 0
            if (customer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if customerdata exists
            let customerdata = await req.model('customer').getCustomerData(customer_data_id)
            if (!customerdata) {
                throw getMessage('udt004')
            }
            // validate if customerdata belongs to loggedin customer
            if (customerdata.customer_id != customer_id) {
                throw getMessage('udt006')
            }
            // validate customerdata records must be more than 1 before delete
            let all_customerdata = await req.model('customer').getAllCustomerData(' AND is_deleted = $1 AND customer_id = $2 ', [false, customer_id])
            if (all_customerdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('customer').deleteCustomerData(customer_data_id)
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }

    fn.deleteSoftCustomerData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objCustomer.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('cst006')
            }
            let customer_data_id = parseInt(req.params.customer_data_id) || 0
            if (customer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if customerdata exists
            let customerdata = await req.model('customer').getCustomerData(customer_data_id)
            if (!customerdata) {
                throw getMessage('udt004')
            }
            // validate if customerdata belongs to loggedin customer
            if (customerdata.customer_id != customer_id) {
                throw getMessage('udt006')
            }
            // validate if customerdata already deleted or not
            if (customerdata.is_deleted == true) {
                throw getMessage('udt010')
            }
            // validate customerdata records must be more than 1 before delete
            let all_customerdata = await req.model('customer').getAllCustomerData(' AND is_deleted = $1 AND customer_id = $2 ', [false, customer_id])
            if (all_customerdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('customer').deleteSoftCustomerData(customer_data_id, {is_deleted : true})
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }


    // END DATA

    return fn
}

module.exports = obj