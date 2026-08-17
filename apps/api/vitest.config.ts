import { defineConfig } from 'vitest/config'
import dotenv from 'dotenv'

// Load test environment
dotenv.config({ path: '.env.test' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'src/scripts/', 'src/test/'],
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    setupFiles: ['./src/test/setup.ts'],
    // Ensure tests run sequentially to avoid DB conflicts
    fileParallelism: false,
    // Only run on specific files if needed
    // include: ['src/**/*.test.ts'],
  },
})