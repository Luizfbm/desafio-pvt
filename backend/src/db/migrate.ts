import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, pool } from './client'

async function main() {
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migrações aplicadas.')
  await pool.end()
}

main().catch((err) => {
  console.error('Falha ao migrar:', err)
  process.exit(1)
})
