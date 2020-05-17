"use strict"
let obj = (rootpath) => {
    const fn = {}
    const cst = require(rootpath + '/config/const.json')

    fn.checkVersion = async (req, res, next) => {
        try{
            let validator = require('validator')
            let version = req.headers['app-version'] || ''
            let platform = req.headers.platform || 'android'

            // validate app-version
            if(validator.isEmpty(version)) {
                throw getMessage('auth017')
            }
            // validate platform
            if(validator.isEmpty(platform)) {
                throw getMessage('auth015')
            }

            let detailVersion = await req.model('version').getActiveVersionCode(version, platform)
            // validate app-version
            if(isEmpty(detailVersion)) {
                throw getMessage('auth018')
            }

            next()
        }catch(e) {next(e)}
    }

    fn.checkToken = async (req, res, next) => {
        try{
            let validator = require('validator')

            let access_token = req.headers['access-token'] || ''

            // validate access token
            if(validator.isEmpty(access_token)) {
                throw getMessage('auth007')
            }

            let detailToken = await req.model('auth').getValidAccessToken(access_token)
            // validate access token
            if(isEmpty(detailToken)) {
                throw getMessage('auth007')
            }

            // if logged in select user information
            if(detailToken.user_id > 0) {

                // get user detail
                let detailUser = await req.model('user').getUser(detailToken.user_id)
                // if user not found, throw error
                if(isEmpty(detailUser)) {
                    // inactive token by device id
                    await req.model('auth').setTokenInactive(detailToken.atoken_device)
                    throw getMessage('auth014')
                }

                // if user is not active
                if(detailUser.user_status != 'active') {
                    // inactive token by device id
                    await req.model('auth').setTokenInactive(detailToken.atoken_device)
                    throw getMessage('auth010')
                }

                // set user & token into request object
                req.objUser = detailUser
                req.objToken = detailToken
            }else{
                // set user & token into request object
                req.objUser = null
                req.objToken = detailToken
            }

            next()
        }catch(e) {next(e)}
    }

    fn.checkLogin = async (req, res, next) => {
        try{
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            let access_token = req.headers['access-token'] || ''

            // validate access token
            if(validator.isEmpty(access_token)) {
                throw getMessage('auth007')
            }

            // get detail token by access token
            let detailToken = await req.model('auth').getValidAccessToken(access_token)

            // validate access token
            if(isEmpty(detailToken)) {
                throw getMessage('auth007')
            }

            // validate user login
            if(detailToken.user_id <= 0) {
                throw getMessage('auth009')
            }

            // get user detail
            let detailUser = await req.model('user').getUser(detailToken.user_id)
            // if user not found, throw error
            if(isEmpty(detailUser)) {
                // inactive token by device id
                await req.model('auth').setTokenInactive(detailToken.atoken_device)
                throw getMessage('auth014')
            }

            // if user is not active
            if(detailUser.user_status != 'active') {
                // inactive token by device id
                await req.model('auth').setTokenInactive(detailToken.atoken_device)
                throw getMessage('auth010')
            }

            // set activity
            await req.model('user').updateUser(detailUser.user_id, {"last_activity": now})

            // set user & token into request object
            req.objUser = detailUser
            req.objToken = detailToken

            next()
        }catch(e) {next(e)}
    }

    fn.getToken = async (req, res, next) => {
        try{
            let validator = require('validator')
            let device_id = req.headers['device-id'] || ''
            let secret_key = req.headers['secret-key'] || ''
            let platform = req.headers.platform || 'android'

            // begin validation
            if(validator.isEmpty(device_id)) {
                throw getMessage('auth001')
            }
            if(validator.isEmpty(secret_key)) {
                throw getMessage('auth005')
            }
            if(validator.isEmpty(platform)) {
                throw getMessage('auth015')
            }
            if(await req.model('auth').verifySecretKey(secret_key) == false) {
                throw getMessage('auth006')
            }
            // end validation

            let userToken = await req.model('auth').getToken(device_id, platform)
            let result = {
                "access_token": userToken.atoken_access,
                "refresh_token": userToken.atoken_refresh
            }
            res.success(result)
        }catch(e) {next(e)}
    }

    fn.validPassword = async (password, savePass) => {
        let crypto = require('crypto')
        // creating a unique salt for a particular user 
        let salt = 'encryptKey'; 

        let hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

        return hash === savePass ? true : false
    }

    fn.login = async (req, res, next) => {
        try{
            let phone = (req.body.phone || '').trim()
            phone = loadLib('sanitize').phoneNumber(phone)

            // check customer is already logged in or not
            if(req.objUser != null) {
                throw getMessage('auth012')
            }

            // validate phone number
            if(loadLib('validation').phoneNumber(phone) == false) {
                throw getMessage('usr001')
            }

            // get user detail
            let detailUser = await req.model('user').getUserPhone(phone)
            // if user not found, throw error
            if(isEmpty(detailUser)) {
                // frontend must detect this error code and redirect to register page
                throw getMessage('auth013')
            }

            // validate password
            let password = await fn.validPassword((req.body.password || '').trim(), detailUser.user_password)
            if(password == false){
                throw getMessage('auth013')
            }

            // if user is not active
            if(detailUser.user_status != 'active') {
                throw getMessage('auth010')
            }

            //do login!
            let dataLogin = {
                'detailUser': detailUser,
                'objToken': req.objToken,
            }
            let is_logged_in = await req.model('user').login(dataLogin)

            if(is_logged_in) {
                res.success(getMessage('success'))
            }else{
                throw getMessage('auth022')
            }


        }catch(e) {next(e)}
    }

    fn.logout = async (req, res, next) => {
        try{
            // validate phone + code
            let validator = require('validator')
            await req.model('auth').setTokenInactive(req.objToken.atoken_device)

            //init user id and platform
            let user_id = parseInt(req.objToken.user_id) || 0
            if(user_id <= 0) {
                throw getMessage("usr006")
            }
            let user_platform = req.objToken.atoken_platform || ''
            if(validator.isEmpty(user_platform)) {
                throw getMessage("auth015")
            }

            res.success(getMessage('success'))
        }catch(e) {next(e)}
    }

    fn.setPassword = async (password) => {
        let crypto = require('crypto')
        // creating a unique salt for a particular user 
        let salt = 'encryptKey'; 
  
        // hashing user's salt and password with 1000 iterations, 64 length and sha512 digest 
        let hash = crypto.pbkdf2Sync(password, salt,  1000, 64, 'sha512').toString('hex'); 

        return hash
    }

    fn.register = async (req, res, next) => {
        try{
            let validator = require('validator')
            let moment = require('moment')
            let now = moment().format('YYYY-MM-DD HH:mm:ss')

            // check customer is already logged in or not
            if(req.objUser != null) {
                throw getMessage('auth012')
            }

            // initialize variable
            let name = (req.body.name || '').trim()
            let email = (req.body.email || '').trim().toLowerCase()
            let phone = (req.body.phone || '').trim()            
            let id_number = (req.body.id_number || '').trim()
            let province = (req.body.province || '').trim().toLowerCase()            
            let birthday = (req.body.province || '').trim()            
            let password = await fn.setPassword((req.body.password || '').trim())

            //sanitize phone number
            phone = loadLib('sanitize').phoneNumber(phone)

            // validate phone number
            if(loadLib('validation').phoneNumber(phone) == false) {
                throw getMessage('usr001')
            }

            // required name
            if(validator.isEmpty(name)) {
                throw getMessage('usr002')
            }
            // Validate username length
            if (!loadLib('validation').validName(name)) {
                throw getMessage('usr018')
            }

            // required email
            if(validator.isEmpty(email)) {
                throw getMessage('usr003')
            }
            // invalid email format
            if(loadLib('validation').isValidEmail(email) == false) {
                throw getMessage('usr004')
            }
            // validate duplicate email
            let dupeEmail = await req.model('user').getUserEmail(email)
            if(isEmpty(dupeEmail) == false) {
                throw getMessage('usr005')
            }

            // validate province
            if(!cst.province.includes(province)){
                throw getMessage('tidak masuk provinsi yang boleh pinjem duit')
            }

            // validate age
            let age = moment().diff(birthday, "years")
            if(age < 17 || age >= 80){
                throw getMessage('belum cukup umur / lewat usia')
            }

            // get user detail
            let detailUser = await req.model('user').getUserPhone(phone)

            // if user not found, then register
            if(isEmpty(detailUser)) {

                let data = {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "id_number": id_number,
                    "province": province,
                    "birthday": moment(birthday, "YYYY-MM-DD"),
                    "password": password,                    
                    "objToken": req.objToken,
                }
                let detailUser = await req.model('user').registration(data)
                req.userobjUser = detailUser
            }else{
                throw getMessage('auth016')
            }

            res.success(getMessage('success'))
        }catch(e) {next(e)}
    }

    fn.refreshToken = async (req, res, next) => {
        try{
            let validator = require('validator')

            let refresh_token = req.headers['refresh-token'] || ''
            // validate access token
            if(validator.isEmpty(refresh_token)) {
                throw getMessage('auth008')
            }

            let detailToken = await req.model('auth').getValidRefreshToken(refresh_token)
            // validate access token
            if(isEmpty(detailToken)) {
                throw getMessage('auth008')
            }

            detailToken = await req.model('auth').getNewToken(detailToken.atoken_id)
            let result = {
                "access_token": detailToken.atoken_access,
                "refresh_token": detailToken.atoken_refresh
            }
            res.success(result)
        }catch(e) {next(e)}
    }


    fn.getVersion = async (req, res, next) => {
        try{
            let validator = require('validator')

            let platform = req.headers.platform || 'android'

            // validate platform
            if(validator.isEmpty(platform)) {
                throw getMessage('auth015')
            }

            let result = await req.model('version').getLastestVersion(platform)

            if(isEmpty(result)) {
                throw getMessage('auth020')
            }
            let version = {
                "code": result.ver_code,
                "platform": result.ver_platform
            }
            res.success(version)

        }catch(e) {next(e)}
    }

    return fn
}

module.exports = obj