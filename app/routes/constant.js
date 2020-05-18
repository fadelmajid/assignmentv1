'use strict'

module.exports = (app) => {
    const constantController = app.controller('constant')

    let aRoutes = [
        // START PROFILE
        {method: 'get', route: '/:const_id', inits: [], middlewares: [constantController.getConstant], auth: 'no'},
        {method: 'post', route: '/', inits: [], middlewares: [constantController.createConstant], auth: 'no'},
        // END PROFILE
    ]
    return aRoutes
}
