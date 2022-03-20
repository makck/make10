module.exports = {
  async up(queryInterface) {
    const userData = [
      {
        name: 'Paul',
        email: 'test1@gmail.com',
        password: 'test1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Johnny',
        email: 'test2@gmail.com',
        password: 'test2',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', userData);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null);
  },
};
