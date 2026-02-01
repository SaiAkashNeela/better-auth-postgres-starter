import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { DATABASE_URL } from '~/libs'

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL in environment variables')
}

const pool = new Pool({
  connectionString: DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export const initDB = async () => {
  try {
    const client = await pool.connect()
    client.release()
    console.log('✅ PostgreSQL Connected')
    return { prisma }
  } catch (err: any) {
    console.error(`❌ PostgreSQL Connection Error: ${err.message}`)
    process.exit(1)
  }
}

export default prisma
