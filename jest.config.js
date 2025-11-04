/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
    transform: { '^.+\\.tsx?$': ['ts-jest', {}] },

    // Se ejecuta ANTES que cualquier import de tests/proyecto
    setupFiles: ['<rootDir>/jest.env.setup.cjs'],
};