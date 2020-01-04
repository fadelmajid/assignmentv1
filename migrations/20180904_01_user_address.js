'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('user_address',
            {
                uadd_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                user_id: {
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
                uadd_title: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                uadd_person: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                uadd_phone: {
                    type: Sequelize.STRING(20),
                    allowNull: false
                },
                uadd_street: {
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
                    queryInterface.addIndex('user_address', ['user_id']),
                    queryInterface.addIndex('user_address', ['prov_id']),
                    queryInterface.addIndex('user_address', ['city_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('user_address');
    }
}