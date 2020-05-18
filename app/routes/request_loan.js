'use strict'

module.exports = (app) => {
    const requestController = app.controller('request_loan')

    let aRoutes = [
        // START PROFILE
        {method: 'post', route: '/', inits: [], middlewares: [requestController.createRequest], auth: 'login'},
        // END PROFILE
    ]
    return aRoutes
}
