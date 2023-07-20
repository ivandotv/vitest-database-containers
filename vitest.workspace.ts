import { defineWorkspace } from 'vitest/config'

const dbPath = './src/__tests__/db/'
export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'database',
      include: [`${dbPath}/**/?(*.)+(spec|test).[jt]s?(x)`],
      environment: 'node',
      setupFiles: [`${dbPath}./vitestPerFileSetup.ts`],
      globalSetup: [
        `${dbPath}./vitestGlobalSetup.ts`,
        `${dbPath}./vitestGlobalTeardown.ts`
      ]
    }
  }
])
