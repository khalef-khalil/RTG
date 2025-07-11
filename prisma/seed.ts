import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialSkills = [
  // FOUNDATION TIER (Center) - Starting point
  { 
    id: 'self-awareness-i', 
    name: 'Self-Awareness I', 
    baseSkill: 'self-awareness',
    level: 1,
    description: 'Begin understanding your core strengths and weaknesses', 
    x: 0, y: 0, 
    completed: false, 
    prerequisites: [], 
    category: 'foundation',
    challenge: {
      title: 'Write exactly 10 things you are good at',
      description: 'Sit down with pen and paper. Write exactly 10 specific things you do well. Examples: "I remember people\'s names", "I can explain complex topics simply", "I stay calm under pressure"',
      type: 'binary',
      timeLimit: 2,
    }
  },

  // TIER 1 - Direct from Self-Awareness I
  { 
    id: 'time-management-i', 
    name: 'Time Management I', 
    baseSkill: 'time-management',
    level: 1,
    description: 'Master basic time tracking and prioritization', 
    x: 200, y: -100, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'foundation',
    challenge: {
      title: 'Track every hour of TODAY in a spreadsheet',
      description: 'Create a spreadsheet with columns: Time, Activity, Productive (Yes/No). Log what you do every hour from 6 AM to 10 PM today. Be brutally honest.',
      type: 'binary',
      timeLimit: 18,
    }
  },
  
  { 
    id: 'communication-i', 
    name: 'Communication I', 
    baseSkill: 'communication',
    level: 1,
    description: 'Master active listening and clear expression', 
    x: -200, y: -100, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'social',
    challenge: {
      title: 'Ask 3 people "How was your day?" and listen for 5 minutes each',
      description: 'Find 3 different people today. Ask them "How was your day?" Then listen for exactly 5 minutes without talking about yourself. Ask follow-up questions only.',
      type: 'count',
      targetValue: 3,
      timeLimit: 12,
    }
  },
  
  { 
    id: 'goal-setting-i', 
    name: 'Goal Setting I', 
    baseSkill: 'goal-setting',
    level: 1,
    description: 'Learn to set SMART goals and create actionable plans', 
    x: 0, y: -200, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'foundation',
    challenge: {
      title: 'Write 3 goals you will complete THIS WEEK',
      description: 'Write exactly 3 goals you can finish in 7 days. Each goal must be 1 sentence and include a number. Example: "Read 50 pages of a book" or "Do 100 push-ups total"',
      type: 'binary',
      timeLimit: 1,
    }
  },

  { 
    id: 'self-discipline-i', 
    name: 'Self-Discipline I', 
    baseSkill: 'self-discipline',
    level: 1,
    description: 'Build consistent daily habits', 
    x: 0, y: 200, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'leadership',
    challenge: {
      title: 'Do 50 push-ups, 100 squats, and drink 8 glasses of water TODAY',
      description: 'Complete exactly 50 push-ups (can be spread throughout day), 100 squats (any style), and drink 8 full glasses of water. Track each one.',
      type: 'binary',
      timeLimit: 16,
    }
  },

  // TIER 2 - Building on Tier 1
  { 
    id: 'time-management-ii', 
    name: 'Time Management II', 
    baseSkill: 'time-management',
    level: 2,
    description: 'Implement advanced productivity systems', 
    x: 400, y: -100, 
    completed: false, 
    prerequisites: ['time-management-i', 'goal-setting-i'], 
    category: 'foundation',
    challenge: {
      title: 'Use Pomodoro technique for 8 hours TODAY',
      description: 'Work in 25-minute focused blocks with 5-minute breaks. Complete exactly 16 pomodoros (8 hours total) today. Use a timer. No exceptions.',
      type: 'count',
      targetValue: 16,
      timeLimit: 12,
    }
  },
  
  { 
    id: 'communication-ii', 
    name: 'Communication II', 
    baseSkill: 'communication',
    level: 2,
    description: 'Master difficult conversations and public speaking', 
    x: -400, y: -100, 
    completed: false, 
    prerequisites: ['communication-i'], 
    category: 'social',
    challenge: {
      title: 'Record yourself explaining something for 2 minutes',
      description: 'Pick any topic you know well. Record a 2-minute video of yourself explaining it clearly. Watch it back. No editing allowed.',
      type: 'binary',
      timeLimit: 1,
    }
  },

  { 
    id: 'critical-thinking-i', 
    name: 'Critical Thinking I', 
    baseSkill: 'critical-thinking',
    level: 1,
    description: 'Analyze information objectively and make better decisions', 
    x: -200, y: -300, 
    completed: false, 
    prerequisites: ['goal-setting-i'], 
    category: 'foundation',
    challenge: {
      title: 'Write 5 assumptions you have about your life and question each one',
      description: 'List 5 things you assume are true about your career, relationships, or goals. For each, write "What if this isn\'t true?" and explore that possibility.',
      type: 'binary',
      timeLimit: 3,
    }
  },

  { 
    id: 'reading-i', 
    name: 'Reading I', 
    baseSkill: 'reading',
    level: 1,
    description: 'Develop speed reading and comprehension skills', 
    x: 200, y: -300, 
    completed: false, 
    prerequisites: ['goal-setting-i'], 
    category: 'foundation',
    challenge: {
      title: 'Read 50 pages of a non-fiction book TODAY',
      description: 'Choose any non-fiction book. Read exactly 50 pages today. Take notes on 10 key points. Time yourself to track reading speed.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  // TIER 3 - Technical Skills Branch
  { 
    id: 'basic-coding-i', 
    name: 'Basic Coding I', 
    baseSkill: 'basic-coding',
    level: 1,
    description: 'Learn fundamental programming concepts', 
    x: 600, y: -100, 
    completed: false, 
    prerequisites: ['time-management-ii'], 
    category: 'technical',
    challenge: {
      title: 'Write "Hello World" in 3 different programming languages',
      description: 'Go to repl.it or similar. Write a program that prints "Hello World" in Python, JavaScript, and one other language. Run each program successfully.',
      type: 'count',
      targetValue: 3,
      timeLimit: 3,
    }
  },

  { 
    id: 'basic-coding-ii', 
    name: 'Basic Coding II', 
    baseSkill: 'basic-coding',
    level: 2,
    description: 'Create simple programs with logic', 
    x: 800, y: -100, 
    completed: false, 
    prerequisites: ['basic-coding-i'], 
    category: 'technical',
    challenge: {
      title: 'Write a program that calculates compound interest',
      description: 'Create a program that takes initial amount, interest rate, and years as input. Calculate and display compound interest. Test with 3 different scenarios.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  { 
    id: 'web-development-i', 
    name: 'Web Development I', 
    baseSkill: 'web-development',
    level: 1,
    description: 'Build your first webpage', 
    x: 600, y: 100, 
    completed: false, 
    prerequisites: ['basic-coding-i'], 
    category: 'technical',
    challenge: {
      title: 'Create a personal webpage with HTML and CSS',
      description: 'Build a simple webpage about yourself. Include: title, paragraph about you, list of 5 skills, and basic CSS styling. Host it on GitHub Pages or similar.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  { 
    id: 'data-analysis-i', 
    name: 'Data Analysis I', 
    baseSkill: 'data-analysis',
    level: 1,
    description: 'Analyze data to find patterns and insights', 
    x: 800, y: 100, 
    completed: false, 
    prerequisites: ['basic-coding-ii'], 
    category: 'technical',
    challenge: {
      title: 'Create a spreadsheet analyzing your phone usage for 7 days',
      description: 'Track your phone screen time daily for 7 days. Create charts showing: daily usage, most used apps, peak usage hours. Draw 3 conclusions.',
      type: 'binary',
      timeLimit: 12,
    }
  },

  // TIER 3 - Social Skills Branch
  { 
    id: 'networking-i', 
    name: 'Networking I', 
    baseSkill: 'networking',
    level: 1,
    description: 'Build meaningful professional relationships', 
    x: -600, y: -100, 
    completed: false, 
    prerequisites: ['communication-ii'], 
    category: 'social',
    challenge: {
      title: 'Send 5 professional messages to people in your field',
      description: 'Find 5 people on LinkedIn in your industry. Send each a personalized message asking one specific question about their work. Get at least 3 responses.',
      type: 'count',
      targetValue: 3,
      timeLimit: 12,
    }
  },

  { 
    id: 'empathy-i', 
    name: 'Empathy I', 
    baseSkill: 'empathy',
    level: 1,
    description: 'Understand and share the feelings of others', 
    x: -600, y: 100, 
    completed: false, 
    prerequisites: ['communication-ii'], 
    category: 'social',
    challenge: {
      title: 'Write down 3 perspectives on a recent disagreement you had',
      description: 'Think of a recent disagreement. Write your perspective, then write how the other person likely saw it, then write how a neutral observer would see it.',
      type: 'binary',
      timeLimit: 2,
    }
  },

  { 
    id: 'negotiation-i', 
    name: 'Negotiation I', 
    baseSkill: 'negotiation',
    level: 1,
    description: 'Reach mutually beneficial agreements', 
    x: -800, y: -100, 
    completed: false, 
    prerequisites: ['networking-i', 'empathy-i'], 
    category: 'social',
    challenge: {
      title: 'Negotiate a better price on something you want to buy',
      description: 'Find something you want to purchase (service, product, subscription). Research fair prices. Negotiate for at least 10% off. Document the process.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  { 
    id: 'public-speaking-i', 
    name: 'Public Speaking I', 
    baseSkill: 'public-speaking',
    level: 1,
    description: 'Present ideas confidently to groups', 
    x: -800, y: 100, 
    completed: false, 
    prerequisites: ['empathy-i'], 
    category: 'social',
    challenge: {
      title: 'Give a 5-minute presentation to at least 3 people',
      description: 'Choose a topic you know well. Prepare a 5-minute presentation with 3 main points. Present to at least 3 people. Get feedback from each person.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  // TIER 3 - Creative Skills Branch
  { 
    id: 'creative-thinking-i', 
    name: 'Creative Thinking I', 
    baseSkill: 'creative-thinking',
    level: 1,
    description: 'Generate innovative solutions and ideas', 
    x: -400, y: -300, 
    completed: false, 
    prerequisites: ['critical-thinking-i'], 
    category: 'creative',
    challenge: {
      title: 'Come up with 20 uses for a paperclip in 10 minutes',
      description: 'Set a timer for 10 minutes. Write down 20 different uses for a paperclip. Be creative - practical and impractical ideas both count.',
      type: 'count',
      targetValue: 20,
      timeLimit: 1,
    }
  },

  { 
    id: 'problem-solving-i', 
    name: 'Problem Solving I', 
    baseSkill: 'problem-solving',
    level: 1,
    description: 'Approach challenges systematically', 
    x: 400, y: -300, 
    completed: false, 
    prerequisites: ['reading-i'], 
    category: 'creative',
    challenge: {
      title: 'Solve a real problem in your life using the 5 Whys technique',
      description: 'Identify a recurring problem in your life. Ask "why" 5 times to get to the root cause. Write down each why and your answer. Propose a solution.',
      type: 'binary',
      timeLimit: 2,
    }
  },

  { 
    id: 'writing-i', 
    name: 'Writing I', 
    baseSkill: 'writing',
    level: 1,
    description: 'Communicate clearly through written word', 
    x: -600, y: -300, 
    completed: false, 
    prerequisites: ['creative-thinking-i'], 
    category: 'creative',
    challenge: {
      title: 'Write a 500-word article about something you learned recently',
      description: 'Choose something you learned in the past month. Write exactly 500 words explaining it clearly. Include an introduction, 3 main points, and conclusion.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'design-thinking-i', 
    name: 'Design Thinking I', 
    baseSkill: 'design-thinking',
    level: 1,
    description: 'Approach problems with user-centered design', 
    x: 600, y: -300, 
    completed: false, 
    prerequisites: ['problem-solving-i'], 
    category: 'creative',
    challenge: {
      title: 'Redesign something you use daily to make it better',
      description: 'Pick an object you use daily (app, tool, etc.). Identify 3 problems with it. Sketch or describe your improved version. Show it to 2 people for feedback.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  // TIER 4 - Leadership Skills Branch
  { 
    id: 'leadership-i', 
    name: 'Leadership I', 
    baseSkill: 'leadership',
    level: 1,
    description: 'Lead a small project or initiative', 
    x: 0, y: 400, 
    completed: false, 
    prerequisites: ['self-discipline-i', 'communication-ii'], 
    category: 'leadership',
    challenge: {
      title: 'Organize dinner plans for 4+ people including yourself',
      description: 'Pick a restaurant, coordinate with 3+ other people, make reservation, confirm everyone can attend. Must happen within 7 days of completing challenge.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  { 
    id: 'project-management-i', 
    name: 'Project Management I', 
    baseSkill: 'project-management',
    level: 1,
    description: 'Plan and execute projects successfully', 
    x: 200, y: 400, 
    completed: false, 
    prerequisites: ['leadership-i'], 
    category: 'leadership',
    challenge: {
      title: 'Create a project plan for learning a new skill in 30 days',
      description: 'Choose a skill you want to learn. Create a detailed 30-day plan with daily tasks, milestones, and success metrics. Include backup plans for obstacles.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'team-building-i', 
    name: 'Team Building I', 
    baseSkill: 'team-building',
    level: 1,
    description: 'Build cohesive and effective teams', 
    x: -200, y: 400, 
    completed: false, 
    prerequisites: ['leadership-i'], 
    category: 'leadership',
    challenge: {
      title: 'Organize a team activity for 4+ people',
      description: 'Plan and execute a team activity (game night, group workout, volunteer activity). Ensure everyone participates and has fun. Get feedback afterward.',
      type: 'binary',
      timeLimit: 12,
    }
  },

  // TIER 4 - Advanced Skills
  { 
    id: 'financial-literacy-i', 
    name: 'Financial Literacy I', 
    baseSkill: 'financial-literacy',
    level: 1,
    description: 'Understand personal finance fundamentals', 
    x: 400, y: 200, 
    completed: false, 
    prerequisites: ['self-discipline-i'], 
    category: 'foundation',
    challenge: {
      title: 'Create a detailed budget for next month',
      description: 'Track all income and expenses for past 7 days. Create a detailed budget for next month with categories. Include savings goal and emergency fund plan.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  { 
    id: 'health-optimization-i', 
    name: 'Health Optimization I', 
    baseSkill: 'health-optimization',
    level: 1,
    description: 'Optimize physical and mental health', 
    x: -400, y: 200, 
    completed: false, 
    prerequisites: ['self-discipline-i'], 
    category: 'foundation',
    challenge: {
      title: 'Create and follow a daily health routine for 7 days',
      description: 'Design a daily routine including: 30min exercise, 8 glasses water, 7+ hours sleep, 5 servings fruits/vegetables. Track compliance for 7 days.',
      type: 'binary',
      timeLimit: 168, // 7 days
    }
  },

  // TIER 5 - Mastery Skills
  { 
    id: 'strategic-thinking-i', 
    name: 'Strategic Thinking I', 
    baseSkill: 'strategic-thinking',
    level: 1,
    description: 'Think long-term and plan strategically', 
    x: 0, y: 600, 
    completed: false, 
    prerequisites: ['project-management-i', 'team-building-i'], 
    category: 'leadership',
    challenge: {
      title: 'Create a 5-year personal development plan',
      description: 'Write a detailed 5-year plan for your career and personal growth. Include yearly milestones, quarterly goals, and monthly actions. Identify potential obstacles.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  { 
    id: 'innovation-i', 
    name: 'Innovation I', 
    baseSkill: 'innovation',
    level: 1,
    description: 'Create novel solutions to complex problems', 
    x: 400, y: 600, 
    completed: false, 
    prerequisites: ['design-thinking-i', 'strategic-thinking-i'], 
    category: 'creative',
    challenge: {
      title: 'Invent a solution to a problem 100+ people face',
      description: 'Identify a problem that affects 100+ people. Research existing solutions. Design a better solution. Create a simple prototype or detailed plan.',
      type: 'binary',
      timeLimit: 12,
    }
  },

  { 
    id: 'systems-thinking-i', 
    name: 'Systems Thinking I', 
    baseSkill: 'systems-thinking',
    level: 1,
    description: 'Understand complex interconnected systems', 
    x: -400, y: 600, 
    completed: false, 
    prerequisites: ['strategic-thinking-i'], 
    category: 'foundation',
    challenge: {
      title: 'Map the system behind a daily habit',
      description: 'Choose a daily habit (morning coffee, checking phone, etc.). Map all the systems that enable it: supply chains, technology, people, economics. Find 10 connections.',
      type: 'binary',
      timeLimit: 4,
    }
  }
]

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
  await prisma.skill.deleteMany()
  
  // Create skills with challenges
  for (const skill of initialSkills) {
    const createdSkill = await prisma.skill.create({
      data: {
        id: skill.id,
        name: skill.name,
        baseSkill: skill.baseSkill,
        level: skill.level,
        description: skill.description,
        x: skill.x,
        y: skill.y,
        completed: skill.completed,
        category: skill.category
      }
    })
    
    // Create associated challenge
    if (skill.challenge) {
      await prisma.challenge.create({
        data: {
          skillId: createdSkill.id,
          title: skill.challenge.title,
          description: skill.challenge.description,
          type: skill.challenge.type,
          targetValue: skill.challenge.targetValue,
          timeLimit: skill.challenge.timeLimit,
          checklistItems: skill.challenge.checklistItems
        }
      })
    }
  }
  
  // Create prerequisite relationships
  for (const skill of initialSkills) {
    if (skill.prerequisites.length > 0) {
      await prisma.skill.update({
        where: { id: skill.id },
        data: {
          prerequisites: {
            connect: skill.prerequisites.map(prereqId => ({ id: prereqId }))
          }
        }
      })
    }
  }
  
  // Create principles
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