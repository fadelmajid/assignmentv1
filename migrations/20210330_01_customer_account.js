'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('customer_account',
            {
                customer_account_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                customer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                customer_account_number: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                customer_account_balance: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                customer_account_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                customer_account_status: {
                    type: Sequelize.ENUM('active', 'inactive'),
                    allowNull: false,
                    defaultValue: 'active'
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
                    queryInterface.addIndex('customer_account', ['customer_id']),
                    queryInterface.addIndex('customer_account', ['customer_account_number'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('customer_account');
    }
}