import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach } from 'vitest'
//import { env } from '../core/config'

// Use a separate test database
const TEST_DB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/ecommerce-test'

export const setupTestDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URI)
    console.log('✅ Test MongoDB connected successfully')
  }
}

export const teardownTestDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
    console.log('✅ Test MongoDB disconnected successfully')
  }
}

export const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  }
}

// Global setup - runs once before all tests
beforeAll(async () => {
  await setupTestDatabase()
})

// Clear database after each test
afterEach(async () => {
  await clearDatabase()
})

// Global teardown - runs once after all tests
afterAll(async () => {
  await teardownTestDatabase()
})