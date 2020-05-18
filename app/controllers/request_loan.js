"use strict"
let obj = (rootpath) => {
    const moment = require('moment')
    const fn = {}

    // BEGIN PROFILE
    fn.createRequest = async (req, res, next) => {
        try {
            let user_id = parseInt(req.objUser.user_id) || 0
            if (user_id <= 0) {
                throw getMessage('usr006')
            }

            // Validate amount
            let amount = req.body.amount || 0
            if (amount < 1000000 || amount > 10000000) {
                throw getMessage('kurang dari 1jt')
            }

            if (amount%1000000 !== 0) {
                throw getMessage('bukan kelipatan 1jt')
            }

            // validate request / day
            let day = req.model('constant').getConstant()

            let data = {
                user_id: user_id,
                reqloan_code: moment().format('HH:mm:ss'),
                reqloan_amount: amount,
                reqloan_status: 'accepted',
                created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // insert data & get detail
            let reqloan_id = await req.model('request').insertRequest(data)
            let result = await req.model('request').getRequest(reqloan_id)

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    return fn
}

module.exports = obj