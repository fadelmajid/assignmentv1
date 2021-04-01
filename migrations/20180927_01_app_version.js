'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        // logic for transforming into the new state
        return queryInterface.createTable('app_version',
            {
                ver_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                ver_code: {
                    type: Sequelize.STRING(50),
                    allowNull: false
                },
                ver_status: {
                    type: Sequelize.ENUM('active', 'inactive'),
                    allowNull: false
                },
                created_by: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                created_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                updated_by: {
                    type: Sequelize.INTEGER,
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
            }).then(function () {
            return [
                queryInterface.addIndex('app_version', ['ver_code'])
            ]
        });
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
        return queryInterface.dropTable('app_version');
    }
}