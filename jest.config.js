/** @prettier */
module.exports = {
  testPathIgnorePatterns: ['<rootDir>/cypress', '<rootDir>/node_modules/'],
  transform: {
    '\\.js$': './jest-transform'
  },
  transformIgnorePatterns: []
};
