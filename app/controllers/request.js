"use strict"
let obj = (rootpath) => {
    const moment = require('moment')
    const fn = {}

    // BEGIN PROFILE
    fn.createRequest = async (req, res, next) => {
        try {
            let customer_id = parseInt(req.objUser.customer_id) || 0
            if (customer_id <= 0) {
                throw getMessage('usr006')
            }

            // Validate amount
            let amount = req.body.amount || 0
            if (amount < 1000000 || amount > 10000000) {
                throw getMessage('req001')
            }

            if (amount % 1000000 !== 0) {
                throw getMessage('req002')
            }

            // validate request / day
            let query = [
                moment().format('YYYY-MM-DD'),
                moment().format('YYYY-MM-DD 23:59:59.000Z')
            ]
            let request_today = await req.model('request').count(query)
            let constant = await req.model('constant').getLastConstant()
            if(request_today.count > constant.day){
                throw getMessage('req003')
            }

            let data = {
                customer_id: customer_id,
                reqloan_code: moment().format('HHmmss'),
                reqloan_amount: amount,
                reqloan_status: 'accepted',
                created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // insert data & get detail
            let reqloan_id = await req.model('request').insertRequest(data)
            let result = await req.model('request').getRequest(reqloan_id.reqloan_id)

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.getAllRequest = async (req, res, next) => {
        try {
            let validator = require('validator')

            // Validate amount
            let amount = req.query.amount || 0
            let status = (req.query.status || 'rejected').trim()

            // insert data & get detail
            let where = ' AND reqloan_amount = $1 AND reqloan_status = $2 '
            let data = [amount, status]
            let order_by = ' created_date DESC '
            let result = await req.model('request').getAllRequest(where, data, order_by)

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    return fn
}

module.exports = obj