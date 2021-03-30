'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('customer_account_directory',
            {
                customer_account_directory_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                customer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                customer_account_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                customer_account_directory_name: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false
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
                    queryInterface.addIndex('customer_account_directory', ['customer_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('customer_account_directory');
    }
}