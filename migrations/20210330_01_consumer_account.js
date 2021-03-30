'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('consumer_account',
            {
                consumer_consumer_account_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                consumer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                consumer_account_number: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                consumer_account_balance: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                consumer_account_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                consumer_account_code: {
                    type: Sequelize.STRING(7),
                    allowNull: true
                },
                consumer_account_status: {
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
                    queryInterface.addIndex('consumer_account', ['consumer_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('consumer_account');
    }
}