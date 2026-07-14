import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString =
  process.env.DATABASE_URL ?? 'postgres://pvt:pvt@localhost:5433/painel'

export const pool = new Pool({ connectionString })
export const db = drizzle(pool, { schema })
