'use strict'

module.exports = (app) => {
    const requestController = app.controller('request')

    let aRoutes = [
        // START PROFILE
        {method: 'get', route: '/all', inits: [], middlewares: [requestController.getAllRequest], auth: 'login'},
        {method: 'post', route: '/', inits: [], middlewares: [requestController.createRequest], auth: 'login'},
        // END PROFILE
    ]
    return aRoutes
}
