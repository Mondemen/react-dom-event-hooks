import globals from "globals";
import pluginJs from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig(
[
	globalIgnores(["dist/*"]),
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	reactHooks.configs["recommended-latest"],
	{
		languageOptions:
		{
			globals: globals.node
		},
		rules:
		{
			"@typescript-eslint/ban-ts-comment": "off",
			"@typescript-eslint/ban-types": "off",
			"@typescript-eslint/consistent-type-imports": "error",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-var-requires": "off",
			"prefer-const": "off",
			"no-ex-assign": "off",
			"no-cond-assign": "off",
			"no-empty": "off",
			"brace-style": ["error", "allman", {allowSingleLine: true}]
		}
	}
]);
