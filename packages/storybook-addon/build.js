const { build } = require('esbuild');
const glob = require('tiny-glob');

(async () => {
  const entryPoints = await glob('src/**/*.{ts,tsx}');
  const formats = ['cjs', 'esm'];
  formats.forEach((format) => {
    build({
      entryPoints,
      format,
      sourcemap: true,
      outdir: `dist/${format}`,
      inject: ['./react-shim.js'],
    });
  });
})();
