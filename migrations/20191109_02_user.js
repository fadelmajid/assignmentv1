'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('user',
            {
                user_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                account_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                user_name: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                user_email: {
                    type: Sequelize.STRING(100),
                    allowNull: true,
                },
                user_address: {
                    type: Sequelize.STRING(250),
                    allowNull: true,
                },
                user_phone: {
                    type: Sequelize.STRING(50),
                    allowNull: true
                },
                user_photo: {
                    type: Sequelize.STRING(100),
                    allowNull: true
                },
                user_nik: {
                    type: Sequelize.STRING(50),
                    allowNull: true
                },
                user_nik_photo: {
                    type: Sequelize.STRING(50),
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
                    queryInterface.addIndex('user', ['account_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('user');
    }
}