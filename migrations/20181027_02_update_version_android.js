'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return Promise.resolve([
            queryInterface.sequelize.query("UPDATE `app_version` SET `ver_platform` = 'android';"),
        ])
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return Promise.resolve([
            queryInterface.sequelize.query("UPDATE `app_version` SET `ver_platform` = NULL;"),
        ]);
    }
}