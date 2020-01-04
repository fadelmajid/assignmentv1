'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('account',
            {
                account_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                account_type: {
                    type: Sequelize.ENUM('user', 'admin', 'unit'),
                    allowNull: true
                },
                account_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                account_password: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                account_status: {
                    type: Sequelize.ENUM('active', 'inactive'),
                    allowNull: false,
                    defaultValue: 'active'
                },
                last_login: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                last_activity: {
                    type: Sequelize.DATE,
                    allowNull: true
                },
                registered_date: {
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
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('account');
    }
}