import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import html from 'eslint-plugin-html'

export default [
	{
		files: ['**/*.html'],
		plugins: { html },
	},
	js.configs.recommended,
	prettier,
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				Alpine: 'readonly', // Tell ESLint Alpine is a global variable
			},
		},
		rules: {
			// Add any custom rules from your old config here
			'no-unused-vars': 'warn',
			'no-console': 'off',
		},
	},
]
