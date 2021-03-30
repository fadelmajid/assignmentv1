"use strict"
let obj = (rootpath) => {
    const moment = require('moment')
    const fn = {}

    // BEGIN PROFILE
    fn.getProfile = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }

            let result = await req.model('customer').getUser(customer_id)
            if (isEmpty(result)) {
                throw getMessage('usr007')
            }

            // don't show the password when get profile
            delete result.customer_password

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateProfile = async (req, res, next) => {
        try {
            let validator = require('validator')
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }

            // Validate username length
            let name = (req.body.customer_name || '').trim()
            if (!loadLib('validation').validName(name)) {
                throw getMessage('usr018')
            }

            let detailUser = await req.model('customer').getUser(customer_id)
            if (isEmpty(detailUser)) {
                throw getMessage('usr007')
            }

            let data = {
                customer_name: name,
                customer_email: (req.body.customer_email || '').toLowerCase() || '',
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // validate name
            if (validator.isEmpty(data.customer_name)) {
                throw getMessage('usr002')
            }
            // validate email
            if (validator.isEmpty(data.customer_email)) {
                throw getMessage('usr003')
            }
            // validate email format
            if (!loadLib('validation').isValidEmail(data.customer_email)) {
                throw getMessage('usr004')
            }
            // validate if email exists and not belong to logged in user
            let dupEmail = await req.model('customer').getUserEmail(data.customer_email)
            if (dupEmail && dupEmail.customer_id !== customer_id) {
                throw getMessage('usr005')
            }

            // insert data & get detail
            await req.model('customer').updateUser(customer_id, data)
            let result = await req.model('customer').getUser(customer_id)

            // don't show password
            delete result.customer_password

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    // START DATA
    fn.getUserData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }
            let udata = parseInt(req.params.customer_data_id) || 0
            if (udata <= 0) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('customer').getUserData(udata)
            if (!result) {
                throw getMessage('udt004')
            }
            // validate if address belongs to loggedin user using not found error message
            if (result.customer_id != customer_id) {
                throw getMessage('udt004')
            }

            res.success(result)
        } catch (e) {next(e)}
    }

    fn.getAllUserData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND customer_id = $2 AND (customer_data_username LIKE $3 OR customer_data_account LIKE $4) '
            let data = [false, customer_id, keyword, keyword]
            let order_by = ' customer_data_id ASC '
            let result = await req.model('customer').getAllUserData(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingUserData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND customer_id = $2 AND (customer_data_username LIKE $3 OR customer_data_account LIKE $4) '
            let data = [false, customer_id, keyword, keyword]
            let order_by = ' customer_data_id ASC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('customer').getPagingUserData(
                where,
                data,
                order_by,
                page_no,
                no_per_page
            )

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createUserData = async (req, res, next) => {
        try {
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }

            // get parameter
            let account = (req.body.account || '').trim()
            let username = (req.body.username || '').trim()
            let password = (req.body.password || '')

            // Start Validate required
            if (validator.isEmpty(account)) {
                throw getMessage('udt001')
            }

            if (validator.isEmpty(username)) {
                throw getMessage('udt002')
            }

            if (validator.isEmpty(password)) {
                throw getMessage('udt003')
            }

            // set variable to insert
            let data = {
                customer_id : customer_id,
                customer_data_account : account,
                customer_data_username : username,
                customer_data_password : password,
                created_date : now
            }

            let customer_data_id = await req.model('customer').insertUserData(data)
            let result = await req.model('customer').getUserData(customer_data_id.customer_data_id)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateUserData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }
            let customer_data_id = parseInt(req.params.customer_data_id) || 0
            if (customer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let userdata = await req.model('customer').getUserData(customer_data_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin user
            if (userdata.customer_id != customer_id) {
                throw getMessage('udt005')
            }

            let data = {
                customer_data_account: (req.body.account || '').trim(),
                customer_data_username: (req.body.username || '').trim(),
                customer_data_password: (req.body.password || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('customer').updateUserData(customer_data_id, data)
            let result = await req.model('customer').getUserData(customer_data_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.deleteUserData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }
            let customer_data_id = parseInt(req.params.customer_data_id) || 0
            if (customer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if userdata exists
            let userdata = await req.model('customer').getUserData(customer_data_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if userdata belongs to loggedin user
            if (userdata.customer_id != customer_id) {
                throw getMessage('udt006')
            }
            // validate userdata records must be more than 1 before delete
            let all_userdata = await req.model('customer').getAllUserData(' AND is_deleted = $1 AND customer_id = $2 ', [false, customer_id])
            if (all_userdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('customer').deleteUserData(customer_data_id)
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }

    fn.deleteSoftUserData = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }
            let customer_data_id = parseInt(req.params.customer_data_id) || 0
            if (customer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if userdata exists
            let userdata = await req.model('customer').getUserData(customer_data_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if userdata belongs to loggedin user
            if (userdata.customer_id != customer_id) {
                throw getMessage('udt006')
            }
            // validate if userdata already deleted or not
            if (userdata.is_deleted == true) {
                throw getMessage('udt010')
            }
            // validate userdata records must be more than 1 before delete
            let all_userdata = await req.model('customer').getAllUserData(' AND is_deleted = $1 AND customer_id = $2 ', [false, customer_id])
            if (all_userdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('customer').deleteSoftUserData(customer_data_id, {is_deleted : true})
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }


    // END DATA

    return fn
}

module.exports = obj