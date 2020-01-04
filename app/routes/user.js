'use strict'

module.exports = (app) => {
    const userController = app.controller('user')

    let aRoutes = [
        // START PROFILE
        {method: 'get', route: '/profile', inits: [], middlewares: [userController.getProfile], auth: 'login'},
        {method: 'put', route: '/profile', inits: [], middlewares: [userController.updateProfile], auth: 'login'},
        // END PROFILE

        // START DATA
        {method: 'get', route: '/data/all', inits: [], middlewares: [userController.getAllUserData], auth: 'login'},
        {method: 'get', route: '/data/:udata_id', inits: [], middlewares: [userController.getUserData], auth: 'login'},
        {method: 'get', route: '/data', inits: [], middlewares: [userController.getPagingUserData], auth: 'login'},
        {method: 'post', route: '/data', inits: [], middlewares: [userController.createUserData], auth: 'login'},
        {method: 'put', route: '/data/:udata_id', inits: [], middlewares: [userController.updateUserData], auth: 'login'},
        {method: 'delete', route: '/data/:udata_id', inits: [], middlewares: [userController.deleteUserData], auth: 'login'},
        {method: 'delete', route: '/data/temp/:udata_id', inits: [], middlewares: [userController.deleteSoftUserData], auth: 'login'},
        // END DATA
    ]
    return aRoutes
}
