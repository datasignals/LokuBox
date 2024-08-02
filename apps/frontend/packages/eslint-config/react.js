const {resolve} = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "prettier",
        require.resolve('@vercel/style-guide/eslint/typescript'),
        require.resolve('@vercel/style-guide/eslint/browser'),
        require.resolve("@vercel/style-guide/eslint/react"),
        "turbo",
        "eslint-config-turbo",
        "@repo/eslint-config/base.js"
    ],
    globals: {
        React: true,
        JSX: true,
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: [
        // "only-warn", //Makes errors into warnings
        "turbo",
        "react",
        "react-hooks"
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
        "**/vite-env.d.ts",
        "**/setupTests.ts",
        "**/reportWebVitals.ts"
    ],
    overrides: [{
        files: [
            "*.js?(x)",
            "*.ts?(x)",
        ]
    }],
    rules: {
        "@typescript-eslint/naming-convention": "off",
        "react/function-component-definition": [
            2,
            {
                namedComponents: "arrow-function",
                unnamedComponents: "arrow-function",
            },
        ],
        "no-console": "off" //TODO remove later
    }
};