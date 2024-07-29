// const { resolve } = require('node:path');
//
// const project = resolve(process.cwd(), 'tsconfig.json');
//
// module.exports = {
//   extends: [
//     '@vercel/style-guide/eslint/node',
//     '@vercel/style-guide/eslint/typescript',
//     'eslint-config-turbo',
//     '@repo/eslint-config/base.js'
//   ].map(require.resolve),
//   parserOptions: {
//     project,
//   },
//   settings: {
//     'import/resolver': {
//       typescript: {
//         project,
//       },
//     },
//   },
//   ignorePatterns: ['node_modules/', 'dist/', 'out/'],
//   // add rules configurations here
//   rules: {
//     "no-console": "off"
//   },
// };


const {resolve} = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "prettier",
        require.resolve('@vercel/style-guide/eslint/typescript'),
        require.resolve('@vercel/style-guide/eslint/node'),
        require.resolve('@vercel/style-guide/eslint/jest'),
        "turbo",
        'eslint-config-turbo',
        '@repo/eslint-config/base.js',
    ],
    plugins: [
        "only-warn", //makes errors into warnings
        "turbo",
    ],
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        ".*.js",
        "node_modules/",
    ],
    overrides: [{
        files: [
            "*.js?(x)",
            "*.ts?(x)",
        ]
    }],
    rules: {
        "no-console": "off",
        "jest/prefer-lowercase-title": "off",
    }
}