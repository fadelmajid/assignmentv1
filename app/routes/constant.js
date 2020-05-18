'use strict'

module.exports = (app) => {
    const constantController = app.controller('constant')

    let aRoutes = [
        // START PROFILE
        {method: 'get', route: '/constant/:const_id', inits: [], middlewares: [constantController.getConstant], auth: 'no'},
        {method: 'post', route: '/constant', inits: [], middlewares: [constantController.addConstant], auth: 'no'},
        // END PROFILE
    ]
    return aRoutes
}
