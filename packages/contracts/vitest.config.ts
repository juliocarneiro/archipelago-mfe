import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // O event bus usa APIs do browser (CustomEvent, window).
    environment: 'jsdom',
  },
});
