const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const js = require("@eslint/js");
const importPlugin = require("eslint-plugin-import");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsAll,
    ],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.app.json", "tsconfig.spec.json"],
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "opis", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "opis", style: "kebab-case" },
      ],
      "@angular-eslint/component-max-inline-declarations": ["warn", { template: 6, styles: 6 }],
      "@angular-eslint/no-experimental": "off",
      "@angular-eslint/component-class-suffix": "off",
      "import/default": "error",
      "import/export": "error",
      "import/no-named-as-default": "warn",
      "import/no-named-as-default-member": "warn",
      "import/no-duplicates": "warn",
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
);
