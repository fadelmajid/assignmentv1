'use strict';
//doc : http://sequelize.readthedocs.io/en/latest/docs/models-definition


module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.addColumn('user_data', 'is_deleted', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            after: "updated_date",
        })
    },
    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.removeColumn('user_data', 'is_deleted')
    }
}