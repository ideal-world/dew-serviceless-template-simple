/* eslint-disable */
module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
    ],
    "parser": "@typescript-eslint/parser", // ESLint解析器，它利用TypeScript ESTree允许ESLint整理TypeScript源代码
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true, // 启用实验室特性
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint", // 为TypeScript代码库提供lint规则
        "react-hooks", // 为react hooks提供规则
        "jsx-a11y", // 静态AST检查器，用于JSX元素上的可访问性规则。
    ],
    "rules": {
        "@typescript-eslint/explicit-module-boundary-types": "off", // 返回值不需要定义类型
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-var-requires": "off",
    },
    "settings": {
        "react": {
            "version": "detect" // 自动选择您安装的版本
        }
    }
};
