import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  hooks: { afterAllFileWrite: ['prettier --write'] },
  schema: 'http://localhost:4001',
  generates: {
    'src/generated.ts': {
      plugins: [
        'typescript',
        'typescript-resolvers',
        {
          add: {
            content: '/* eslint-disable */',
          },
        },
        {
          add: {
            placement: 'append',
            content: '/* eslint-enable */',
          },
        },
      ],
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
