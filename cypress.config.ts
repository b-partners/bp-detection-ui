import { defineConfig } from 'cypress';

export default defineConfig({
  viewportHeight: 500,
  viewportWidth: 700,
  defaultCommandTimeout: 30000,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
