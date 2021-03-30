"use strict"
let obj = (rootpath) => {
    const moment = require('moment')
    const fn = {}

    // BEGIN PROFILE
    fn.getProfile = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }

            let result = await req.model('consumer').getUser(consumer_id)
            if (isEmpty(result)) {
                throw getMessage('usr007')
            }

            // don't show the password when get profile
            delete result.consumer_password

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateProfile = async (req, res, next) => {
        try {
            let validator = require('validator')
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }

            // Validate username length
            let name = (req.body.consumer_name || '').trim()
            if (!loadLib('validation').validName(name)) {
                throw getMessage('usr018')
            }

            let detailUser = await req.model('consumer').getUser(consumer_id)
            if (isEmpty(detailUser)) {
                throw getMessage('usr007')
            }

            let data = {
                consumer_name: name,
                consumer_email: (req.body.consumer_email || '').toLowerCase() || '',
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // validate name
            if (validator.isEmpty(data.consumer_name)) {
                throw getMessage('usr002')
            }
            // validate email
            if (validator.isEmpty(data.consumer_email)) {
                throw getMessage('usr003')
            }
            // validate email format
            if (!loadLib('validation').isValidEmail(data.consumer_email)) {
                throw getMessage('usr004')
            }
            // validate if email exists and not belong to logged in user
            let dupEmail = await req.model('consumer').getUserEmail(data.consumer_email)
            if (dupEmail && dupEmail.consumer_id !== consumer_id) {
                throw getMessage('usr005')
            }

            // insert data & get detail
            await req.model('consumer').updateUser(consumer_id, data)
            let result = await req.model('consumer').getUser(consumer_id)

            // don't show password
            delete result.consumer_password

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    // START DATA
    fn.getUserData = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }
            let udata = parseInt(req.params.consumer_data_id) || 0
            if (udata <= 0) {
                throw getMessage('udt001')
            }
            // validate if address exists
            let result = await req.model('consumer').getUserData(udata)
            if (!result) {
                throw getMessage('udt004')
            }
            // validate if address belongs to loggedin user using not found error message
            if (result.consumer_id != consumer_id) {
                throw getMessage('udt004')
            }

            res.success(result)
        } catch (e) {next(e)}
    }

    fn.getAllUserData = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND consumer_id = $2 AND (consumer_data_username LIKE $3 OR consumer_data_account LIKE $4) '
            let data = [false, consumer_id, keyword, keyword]
            let order_by = ' consumer_data_id ASC '
            let result = await req.model('consumer').getAllUserData(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getPagingUserData = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }

            let keyword = req.query.keyword || ''
            keyword = '%' + keyword + '%'
            let where = ' AND is_deleted = $1 AND consumer_id = $2 AND (consumer_data_username LIKE $3 OR consumer_data_account LIKE $4) '
            let data = [false, consumer_id, keyword, keyword]
            let order_by = ' consumer_data_id ASC '
            let page_no = req.query.page || 0
            let no_per_page = req.query.perpage || 0
            let result = await req.model('consumer').getPagingUserData(
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

            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
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
                consumer_id : consumer_id,
                consumer_data_account : account,
                consumer_data_username : username,
                consumer_data_password : password,
                created_date : now
            }

            let consumer_data_id = await req.model('consumer').insertUserData(data)
            let result = await req.model('consumer').getUserData(consumer_data_id.consumer_data_id)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.updateUserData = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }
            let consumer_data_id = parseInt(req.params.consumer_data_id) || 0
            if (consumer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if data exists
            let userdata = await req.model('consumer').getUserData(consumer_data_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if data belongs to loggedin user
            if (userdata.consumer_id != consumer_id) {
                throw getMessage('udt005')
            }

            let data = {
                consumer_data_account: (req.body.account || '').trim(),
                consumer_data_username: (req.body.username || '').trim(),
                consumer_data_password: (req.body.password || '').trim(),
                updated_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            await req.model('consumer').updateUserData(consumer_data_id, data)
            let result = await req.model('consumer').getUserData(consumer_data_id)
            res.success(result)
        } catch(e) {next(e)}
    }

    fn.deleteUserData = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }
            let consumer_data_id = parseInt(req.params.consumer_data_id) || 0
            if (consumer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if userdata exists
            let userdata = await req.model('consumer').getUserData(consumer_data_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if userdata belongs to loggedin user
            if (userdata.consumer_id != consumer_id) {
                throw getMessage('udt006')
            }
            // validate userdata records must be more than 1 before delete
            let all_userdata = await req.model('consumer').getAllUserData(' AND is_deleted = $1 AND consumer_id = $2 ', [false, consumer_id])
            if (all_userdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('consumer').deleteUserData(consumer_data_id)
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }

    fn.deleteSoftUserData = async (req, res, next) => {
        try {
            let consumer_id = parseInt(req.objUser.consumer_id) || 0
            if (consumer_id <= 0) {
                throw getMessage('usr006')
            }
            let consumer_data_id = parseInt(req.params.consumer_data_id) || 0
            if (consumer_data_id <= 0) {
                throw getMessage('udt001')
            }
            // validate if userdata exists
            let userdata = await req.model('consumer').getUserData(consumer_data_id)
            if (!userdata) {
                throw getMessage('udt004')
            }
            // validate if userdata belongs to loggedin user
            if (userdata.consumer_id != consumer_id) {
                throw getMessage('udt006')
            }
            // validate if userdata already deleted or not
            if (userdata.is_deleted == true) {
                throw getMessage('udt010')
            }
            // validate userdata records must be more than 1 before delete
            let all_userdata = await req.model('consumer').getAllUserData(' AND is_deleted = $1 AND consumer_id = $2 ', [false, consumer_id])
            if (all_userdata.length < 1) {
                throw getMessage('udt009')
            }

            await req.model('consumer').deleteSoftUserData(consumer_data_id, {is_deleted : true})
            res.success(getMessage('udt008'))
        } catch (e) {next(e)}
    }


    // END DATA

    return fn
}

module.exports = obj