"use strict"
let obj = (rootpath) => {
    const moment = require('moment')
    const fn = {}

    // BEGIN PROFILE
    fn.getConstant = async (req, res, next) => {
        try {
            let const_id = parseInt(req.params.const_id) || 0
            if (const_id <= 0) {
                throw getMessage('Tidak boleh 0')
            }

            let result = await req.model('constant').getConstant(const_id)
            if (isEmpty(result)) {
                throw getMessage('tidak ada data')
            }

            res.success(result)
        } catch(e) {next(e)}
    }

    fn.createConstant = async (req, res, next) => {
        try {
            // Validate username length
            let day_max = req.body.day_max || 0
            if (day_max <= 0) {
                throw getMessage('tidak boleh 0')
            }

            let data = {
                day: day_max,
                created_date: moment().format('YYYY-MM-DD HH:mm:ss')
            }

            // insert data & get detail
            let const_id = await req.model('constant').insertConstant(data)
            let result = await req.model('constant').getConstant(const_id)

            res.success(result)
        } catch(e) {next(e)}
    }
    // END PROFILE

    return fn
}

module.exports = obj