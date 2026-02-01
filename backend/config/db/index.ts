import { PrismaClient } from '@prisma/client'

// Using standard PrismaClient for stability in Bun 
// The driver adapter (@prisma/adapter-pg) can sometimes conflict with Better Auth's internal logic.
export const DB = new PrismaClient()

export const initDB = async () => {
  try {
    await DB.$connect()
    console.log('✅ PostgreSQL Connected')
  } catch (err: any) {
    console.error(`❌ PostgreSQL Connection Error: ${err.message}`)
    process.exit(1)
  }
}

export default DB
