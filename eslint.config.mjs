import * as sapphireEslintConfig from '@sapphire/eslint-config';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		...compat.config(sapphireEslintConfig)
	}
]
