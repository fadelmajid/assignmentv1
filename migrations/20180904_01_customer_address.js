'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('customer_address',
            {
                customer_add_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                customer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                prov_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                city_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                customer_add_title: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                customer_add_person: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                customer_add_phone: {
                    type: Sequelize.STRING(20),
                    allowNull: false
                },
                customer_add_street: {
                    type: Sequelize.TEXT(),
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
                    queryInterface.addIndex('customer_address', ['customer_id']),
                    queryInterface.addIndex('customer_address', ['prov_id']),
                    queryInterface.addIndex('customer_address', ['city_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('customer_address');
    }
}