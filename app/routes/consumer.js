'use strict'

module.exports = (app) => {
    const consumerController = app.controller('consumer')

    let aRoutes = [
        // START PROFILE
        {method: 'get', route: '/profile', inits: [], middlewares: [consumerController.getProfile], auth: 'login'},
        {method: 'put', route: '/profile', inits: [], middlewares: [consumerController.updateProfile], auth: 'login'},
        // END PROFILE
    ]
    return aRoutes
}
