'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('user_example',
            {
                user_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                user_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                user_code: {
                    type: Sequelize.STRING(7),
                    allowNull: true
                },
                user_email: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                user_phone: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                user_identification_id: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                user_birthday: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                user_province: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                user_status: {
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
                    queryInterface.addIndex('user_example', ['user_email']),
                    queryInterface.addIndex('user_example', ['user_phone']),
                    queryInterface.addIndex('user_example', ['user_code'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('user_example');
    }
}