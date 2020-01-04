'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('request',
            {
                request_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
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
                request_title: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                request_feedback: {
                    type: Sequelize.STRING(250),
                    allowNull: true,
                },
                request_status: {
                    type: Sequelize.ENUM('in_progress', 'completed', 'rejected'),
                    allowNull: true
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                updated_by: {
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
                    queryInterface.addIndex('request', ['user_id']),
                    queryInterface.addIndex('request', ['service_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('request');
    }
}