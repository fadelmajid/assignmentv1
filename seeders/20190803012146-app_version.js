'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('app_version', [
      {
          ver_code: "0.9.0",
          ver_platform: "android",
          ver_status: "active",
          created_by: 1,
          created_date: "2019-08-03"
      },
      {
        ver_code: "0.9.0",
        ver_platform: "ios",
        ver_status: "active",
        created_by: 1,
        created_date: "2019-08-03"
      },
      {
        ver_code: "0.9.0",
        ver_platform: "ios",
        ver_status: "web",
        created_by: 1,
        created_date: "2019-08-03"
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */


    return queryInterface.bulkDelete('app_version', null, {});
  }
};
