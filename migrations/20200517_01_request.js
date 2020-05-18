'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('request_loan',
            {
                reqloan_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                reqloan_code: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                reqloan_amount: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                reqloan_status: {
                    type: Sequelize.ENUM('accepted', 'rejected'),
                    allowNull: false,
                    defaultValue: 'rejected'
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
                    queryInterface.addIndex('request_loan', ['user_id']),
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('request_loan');
    }
}