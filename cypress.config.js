import codeCoverageTask from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';
import cypressSonarqubeReporter from 'cypress-sonarqube-reporter/mergeReports';
import vitePreprocessor from 'cypress-vite';
const timeout = 60000;

export default defineConfig({
  viewportHeight: 500,
  viewportWidth: 700,
  defaultCommandTimeout: timeout,

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
      exclude: ['cypress/**/*.*', 'src/**/*.cy.*'],
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
      on('file:preprocessor', vitePreprocessor());
      on('after:run', cypressSonarqubeReporter);

      codeCoverageTask(on, config);

      return config;
    },
  },
});
