'use strict';
//doc : http://sequelize.readthedocs.io/en/latest/docs/models-definition


module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.changeColumn('app_version', 'ver_status', {
            type: Sequelize.STRING(10),
            allowNull: true
        })
    },
    down: function (queryInterface, Sequelize) {
        // logic for reverting into the new state
        return queryInterface.changeColumn('app_version', 'ver_status', {
            type: Sequelize.STRING(10),
            allowNull: true
        })
    },
}