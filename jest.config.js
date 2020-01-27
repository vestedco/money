module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '.*\\.ts$': 'ts-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/lib/*.ts'
  ]
}
