import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
    scanner: 'src/core/scanner.ts',
    consolidator: 'src/core/consolidator.ts',
    transformer: 'src/core/transformer.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: ['postcss', 'glob', 'commander', 'chalk'],
});
