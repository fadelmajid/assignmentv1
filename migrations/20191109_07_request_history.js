'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('request_history',
            {
                request_history_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                request_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                service_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('request_history', ['request_id']),
                    queryInterface.addIndex('request_history', ['service_id']),
                    queryInterface.addIndex('request_history', ['user_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('request_history');
    }
}