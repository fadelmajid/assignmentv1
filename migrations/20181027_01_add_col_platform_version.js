'use strict';
//doc : http://sequelize.readthedocs.io/en/latest/docs/models-definition


module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.addColumn('app_version', 'ver_platform', {
            type: Sequelize.TEXT,
            allowNull: true,
            after: "ver_code",
        })
    },
    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.removeColumn('app_version', 'ver_platform')
    }
}