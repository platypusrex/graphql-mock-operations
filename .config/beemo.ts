import { BeemoConfig } from '@beemo/core';

const config: BeemoConfig = {
  module: '@platypusrex/dev-configs',
  drivers: {
    eslint: {
      args: ['--cache-location', './node_modules/.cache/eslint', '--cache'],
    },
    prettier: true,
    typescript: {
      declarationOnly: true,
      buildFolder: 'dist/dts',
    },
  },
  settings: {
    useBuiltIns: false,
    node: true,
  },
};

export default config;
