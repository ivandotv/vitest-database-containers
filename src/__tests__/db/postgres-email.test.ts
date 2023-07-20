import { Pool } from 'pg'
import { PostgresRepository } from '../../postgres/postgres-repository'
import {
  createAndConnectToTestDatbase,
  disconnectFromTestDatabase,
  resetDatabase,
  seedDatabase
} from './utils/postgres-test-utils'

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test
} from 'vitest'

let connection: Pool

describe('Postgres email', () => {
  beforeAll(async () => {
    connection = await createAndConnectToTestDatbase()
  })

  beforeEach(async () => {
    await seedDatabase(connection)
  })

  afterEach(async () => {
    await resetDatabase(connection)
  })

  afterAll(async () => {
    await disconnectFromTestDatabase(connection)
  })

  test('Get user by email', async () => {
    const email = 'ivan@example.com'
    const repository = new PostgresRepository(connection)
    const user = await repository.getUserByEmail(email)

    expect(user?.email).toBe(email)
  })
})
