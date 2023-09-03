'use strict';

/**
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chatTemplates', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      rateLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tokenLimit: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      enforcedModel: {
        type: Sequelize.ENUM('none', 'gpt3', 'gpt4'),
        allowNull: false,
      },
      additionalContext: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chatTemplates');
  }
};
