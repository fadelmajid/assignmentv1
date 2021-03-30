'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('consumer_data',
            {
                consumer_data_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                consumer_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                consumer_data_account: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                consumer_data_username: {
                    type: Sequelize.STRING(100),
                    allowNull: false
                },
                consumer_data_password: {
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
                    queryInterface.addIndex('consumer_data', ['consumer_id'])
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('consumer_data');
    }
}