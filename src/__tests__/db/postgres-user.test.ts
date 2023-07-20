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

describe('Postgres user', () => {
  beforeAll(async () => {
    connection = await createAndConnectToTestDatbase()
  })

  beforeEach(async () => {
    // await resetDatabase(connection)
    await seedDatabase(connection)
  })
  afterEach(async () => {
    await resetDatabase(connection)
  })

  afterAll(async () => {
    await disconnectFromTestDatabase(connection)
  })

  test('Create user', async () => {
    const user = {
      email: 'new_user@example.com',
      name: 'New Guy',
      lastName: 'Rookie'
    }
    const repository = new PostgresRepository(connection)
    const createdUser = await repository.createUser(user)

    const queryUser = await repository.getUserByEmail(user.email)

    expect(createdUser?.email).toEqual(user.email)
    expect(queryUser?.email).toEqual(createdUser?.email)
  })

  test('Count users', async () => {
    const repository = new PostgresRepository(connection)
    const users = await repository.getAllUsers()

    //3 users from initial seed
    expect(users).toHaveLength(3)
  })
})
