'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('auth_token',
            {
                atoken_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                customer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                atoken_device: {
                    type: Sequelize.STRING(200),
                    allowNull: true
                },
                atoken_platform: {
                    type: Sequelize.STRING(200),
                    allowNull: true
                },
                atoken_access: {
                    type: Sequelize.STRING(200),
                    allowNull: true
                },
                atoken_refresh: {
                    type: Sequelize.STRING(200),
                    allowNull: true
                },
                atoken_status: {
                    type: Sequelize.ENUM('active', 'inactive'),
                    allowNull: false,
                    defaultValue: 'active'
                },
                expired_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                updated_date: {
                    type: Sequelize.DATE,
                    allowNull: true
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            })
            .then(function () {
                return [
                    queryInterface.addIndex('auth_token', ['customer_id']),
                    queryInterface.addIndex('auth_token', ['atoken_device', 'atoken_status']),
                    queryInterface.addIndex('auth_token', ['atoken_refresh', 'atoken_status']),
                    queryInterface.addIndex('auth_token', ['atoken_access', 'atoken_status', 'expired_date'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('auth_token');
    }
}