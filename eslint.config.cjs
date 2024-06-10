// eslint.config.cjs
const globals = require('globals');
const airbnbBase = require('eslint-config-airbnb-base');
const importPlugin = require('eslint-plugin-import');

module.exports = [
    {
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            ...airbnbBase.rules,
            'no-useless-catch': 'off',
            'no-underscore-dangle': 'off',
            'no-param-reassign': 'off',
            'class-methods-use-this': 'off',
            'newline-per-chained-call': 'off',
            'linebreak-style': 'off',
            'no-console': 'off',
            'max-len': ['error', { code: 200 }],
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'import/extensions': ['error', 'ignorePackages', { js: 'allow', json: 'allow' }],
            'no-shadow': 'off',
            'no-nested-ternary': 'off',
            'import/prefer-default-export': 'off',
            'no-restricted-syntax': 'off',
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
    },
];
