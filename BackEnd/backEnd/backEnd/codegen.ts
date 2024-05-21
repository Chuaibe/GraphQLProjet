import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: "src/schema.ts",
  generates: {
    "src/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-resolvers"
      ]
    }
  }
};

export default config;