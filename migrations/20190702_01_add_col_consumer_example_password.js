'use strict';
//doc : http://sequelize.readthedocs.io/en/latest/docs/models-definition


module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.addColumn('consumer', 'consumer_password', {
            type: Sequelize.TEXT,
            allowNull: true,
            after: "consumer_name",
        })
    },
    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.removeColumn('consumer', 'consumer_password')
    }
}