'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('consumer_address',
            {
                consumer_add_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                consumer_id: {
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
                consumer_add_title: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                consumer_add_person: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                consumer_add_phone: {
                    type: Sequelize.STRING(20),
                    allowNull: false
                },
                consumer_add_street: {
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
                    queryInterface.addIndex('consumer_address', ['consumer_id']),
                    queryInterface.addIndex('consumer_address', ['prov_id']),
                    queryInterface.addIndex('consumer_address', ['city_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('consumer_address');
    }
}