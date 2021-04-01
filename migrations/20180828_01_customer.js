'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('customer',
            {
                customer_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                customer_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                customer_code: {
                    type: Sequelize.STRING(7),
                    allowNull: true
                },
                customer_email: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                customer_phone: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                customer_identification_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                customer_birthday: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                customer_province: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                customer_status: {
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
                    queryInterface.addIndex('customer', ['customer_email']),
                    queryInterface.addIndex('customer', ['customer_phone']),
                    queryInterface.addIndex('customer', ['customer_code'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('customer');
    }
}