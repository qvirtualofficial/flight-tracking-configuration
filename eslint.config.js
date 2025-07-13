import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * @type {import("eslint").Linter.Config}
 * */
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "coverage/**",
      "*.config.js",
      "*.config.ts",
    ],
  },
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  reactCompiler.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/consistent-return": "off",
      "@typescript-eslint/consistent-type-definitions": ["off", "type"],
      "@typescript-eslint/consistent-type-exports": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/dot-notation": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-deprecated": "off",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-import-type-side-effects": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unnecessary-template-expression": "off",
      "@typescript-eslint/no-unnecessary-type-arguments": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-type-assertion": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { caughtErrors: "none", ignoreRestSiblings: true },
      ],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/non-nullable-type-assertion-style": "off",
      "@typescript-eslint/prefer-destructuring": "off",
      "@typescript-eslint/prefer-for-of": "off",
      "@typescript-eslint/prefer-includes": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/prefer-promise-reject-errors": "off",
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      "@typescript-eslint/prefer-reduce-type-parameter": "off",
      "@typescript-eslint/prefer-regexp-exec": "off",
      "@typescript-eslint/prefer-string-starts-ends-with": "off",
      "@typescript-eslint/promise-function-async": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/switch-exhaustiveness-check": "off",
      "@typescript-eslint/unbound-method": "off",
      "no-fallthrough": ["error", { allowEmptyCase: true }],
      "react-compiler/react-compiler": "error",
    },
  },
  eslintConfigPrettier,
  {
    plugins: {
      perfectionist: perfectionist,
    },
    rules: {
      ...perfectionist.configs["recommended-natural"].rules,
      "perfectionist/sort-variable-declarations": "off",
      "perfectionist/sort-intersection-types": "off",
      "perfectionist/sort-heritage-clauses": "off",
      "perfectionist/sort-array-includes": "off",
      "perfectionist/sort-named-imports": "off",
      "perfectionist/sort-named-exports": "off",
      "perfectionist/sort-object-types": "off",
      "perfectionist/sort-union-types": "off",
      "perfectionist/sort-switch-case": "off",
      "perfectionist/sort-interfaces": "off",
      "perfectionist/sort-decorators": "off",
      "perfectionist/sort-jsx-props": "off",
      "perfectionist/sort-modules": "off",
      "perfectionist/sort-classes": "off",
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-exports": "off",
      "perfectionist/sort-objects": "off",
      "perfectionist/sort-enums": "off",
      "perfectionist/sort-sets": "off",
      "perfectionist/sort-maps": "off",
    },
  },
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off",
    },
  },
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
    settings: { react: { version: "detect" } },
  },
);
