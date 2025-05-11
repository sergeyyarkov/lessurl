import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: './dist/index.js',
  format: 'esm',
  platform: 'node',
  packages: 'external',
  minify: true,
});
