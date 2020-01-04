'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('history_device',
            {
                hd_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                atoken_device: {
                    type: Sequelize.STRING(200),
                    allowNull: false
                },
                atoken_platform: {
                    type: Sequelize.STRING(200),
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                }
            }, {
                freezeTableName: true,
                engine: 'InnoDB',
                charset: 'utf8'
            }).
            then(function () {
                return [
                    queryInterface.addIndex('history_device', ['atoken_device', 'atoken_platform'], {indexName: 'history_device_unique', indicesType: 'UNIQUE'})
                ]
            });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('history_device');
    }
}