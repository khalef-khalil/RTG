import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialPrinciples = [
  {
    text: 'Start each day by identifying your top 3 priorities',
    type: 'do',
    category: 'Productivity',
    source: 'Personal experience'
  },
  {
    text: 'Listen more than you speak in conversations',
    type: 'do',
    category: 'Communication',
    source: 'Dale Carnegie'
  },
  {
    text: 'Never make important decisions when you\'re emotional',
    type: 'dont',
    category: 'Decision Making',
    source: 'Life lesson'
  },
  {
    text: 'Compare yourself to others on social media',
    type: 'dont',
    category: 'Mental Health',
    source: 'Psychology research'
  },
  {
    text: 'Invest in yourself through continuous learning',
    type: 'do',
    category: 'Growth',
    source: 'Warren Buffett'
  },
]

async function main() {
  console.log('Seeding database...')
  
  // Clear existing data
  await prisma.principle.deleteMany()
  await prisma.challenge.deleteMany()
  
  // Create principles only
  for (const principle of initialPrinciples) {
    await prisma.principle.create({
      data: principle
    })
  }
  
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 