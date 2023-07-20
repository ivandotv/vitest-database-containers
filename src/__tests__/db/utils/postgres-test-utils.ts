import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Pool, PoolConfig } from 'pg'
import { postgresConnection } from '../../../postgres/postgres-connection'

const testDbName = `test_db_${process.env.VITEST_POOL_ID}`.toLowerCase()

async function createTestDatabase(dbName: string) {
  const connectionConfig: PoolConfig = {
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT)
  }

  const connection = await postgresConnection(connectionConfig)

  await connection.query(`CREATE DATABASE ${dbName}`)

  await connection.end()
}

export async function createAndConnectToTestDatbase() {
  await createTestDatabase(testDbName)

  const connectionConfig: PoolConfig = {
    host: 'localhost',
    user: process.env.POSTGRES_USER,
    database: testDbName,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT)
  }

  return postgresConnection(connectionConfig)
}

export function disconnectFromTestDatabase(client: Pool) {
  return client.end()
}

export async function seedDatabase(client: Pool) {
  const seedFile = await readFile(resolve(__dirname, './seed.sql'), {
    encoding: 'utf8'
  })
  await client.query(seedFile)
}

export async function resetDatabase(client: Pool, schemaName = 'public') {
  // truncate all tables in the database
  // https://stackoverflow.com/a/12082038/1489487

  const truncateTablesQuery = `
      DO
      $func$
      BEGIN
        EXECUTE (
          SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
            FROM pg_class
            WHERE relkind = 'r'
            AND relnamespace = '${schemaName}'::regnamespace
        );
      END
      $func$;
    `

  await client.query(truncateTablesQuery)
}
