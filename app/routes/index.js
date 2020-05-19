'use strict';

module.exports = (app, router) => {
    const mainController = app.controller('main');
    const authController = app.controller('auth');

    router.use('/auth', app.route('auth', authController));
    router.use('/user', app.route('user', authController));
    router.use('/constant', app.route('constant', authController));
    router.use('/request', app.route('request', authController));
    router.get('/', mainController.index);
};
