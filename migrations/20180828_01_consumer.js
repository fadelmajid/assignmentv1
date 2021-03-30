'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('consumer',
            {
                consumer_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                consumer_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                consumer_code: {
                    type: Sequelize.STRING(7),
                    allowNull: true
                },
                consumer_email: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                consumer_phone: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                consumer_identification_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                consumer_birthday: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                consumer_province: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                consumer_status: {
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
                    queryInterface.addIndex('consumer', ['consumer_email']),
                    queryInterface.addIndex('consumer', ['consumer_phone']),
                    queryInterface.addIndex('consumer', ['consumer_code'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('consumer');
    }
}