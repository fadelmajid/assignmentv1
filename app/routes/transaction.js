'use strict'

module.exports = (app) => {
    const trxController = app.controller('transaction')

    let aRoutes = [
        // START TRANSACTION
        {method: 'get', route: '/all', inits: [], middlewares: [trxController.getAllTransaction], auth: 'login'},
        {method: 'get', route: '/', inits: [], middlewares: [trxController.getPagingTransaction], auth: 'login'},
        {method: 'get', route: '/:transaction_id', inits: [], middlewares: [trxController.getTransaction], auth: 'login'}
        // END TRANSACTION
    ]
    return aRoutes
}
