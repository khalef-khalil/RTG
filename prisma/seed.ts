import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Clearing database...')
  
  // Clear all existing data
  await prisma.principle.deleteMany()
  await prisma.challenge.deleteMany()
  
  console.log('Database cleared successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 