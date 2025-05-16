import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
import { createRequire } from 'node:module';

export default defineConfig({
  viewportHeight: 500,
  viewportWidth: 700,
  defaultCommandTimeout: 30000,

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, cypress-sonarqube-reporter',
    cypressSonarqubeReporterReporterOptions: {
      overwrite: true,
      outputDir: 'dist/test-reports',
      mergeOutputDir: 'dist/test-reports',
      mergeFileName: 'reports.all.xml',
    },
  },

  env: {
    codeCoverage: {
      exclude: ['cypress/**/*.*', 'src/**/*.cy'],
    },
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/__tests__/components/*.cy.{tsx,ts}',
  },

  e2e: {
    setupNodeEvents(on, config) {
      const require = createRequire(import.meta.url);

      on('file:preprocessor', vitePreprocessor());
      on('after:run', require('cypress-sonarqube-reporter/mergeReports'));

      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },
});
