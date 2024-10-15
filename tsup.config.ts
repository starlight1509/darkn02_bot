import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	outDir: 'build',
	bundle: false,
	dts: false,
	entry: ['src/**/*.ts', '!src/**/*.d.ts'],
	format: ['esm'],
	minify: false,
	tsconfig: 'src/tsconfig.json',
	target: 'esnext',
	splitting: false,
	skipNodeModulesBundle: true,
	sourcemap: true,
	shims: false,
	keepNames: true
});
