const stylistic = require('@stylistic/eslint-plugin');

//Stylistic options
const customized = stylistic.configs.customize({
    // the following options are the default values
    indent: 4,
    quotes: 'double',
    semi: true,
    jsx: true,
})


//TODO base is there to disable some errors/warning that can be sorted later
module.exports = {
    extends: [
        "eslint:recommended",
        "prettier",
        "turbo",
    ],
    plugins: [
        '@stylistic'
    ],
    rules: {
        // ...customized.rules,
        "no-unused-vars": "warn",
        "unicorn/filename-case": [
            "warn",
            {
                "case": "pascalCase",
            }
        ],
        "eslint-comments/require-description": "off",

        'import/no-default-export': 'warn',
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/naming-convention": "warn",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-shadow": "off", //some weird problem when function has the same parameter name as declared const value
        "@typescript-eslint/no-confusing-void-expression": "warn", //I like my arrow functions that return void, it might be not the best but pretty
        "@typescript-eslint/ban-ts-comment": "warn"
    },
};
