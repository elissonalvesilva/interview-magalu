const config = require('./jest.config');
config.testMatch = ['**/*.test.ts'];
config.setupFiles = ['dotenv/config'];

module.exports = config;
