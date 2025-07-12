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
      title: 'Write exactly 10 specific skills you have with evidence',
      description: 'List 10 skills you possess. For each, write one specific example of when you used it successfully. Example: "I can explain complex topics simply - I taught my friend calculus and they understood derivatives"',
      type: 'binary',
      timeLimit: 3,
    }
  },

  // TIER 1 - Core Foundation Skills
  { 
    id: 'basic-math-i', 
    name: 'Basic Math I', 
    baseSkill: 'basic-math',
    level: 1,
    description: 'Master fundamental arithmetic and percentages', 
    x: 300, y: 0, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'foundation',
    challenge: {
      title: 'Solve 50 math problems without a calculator',
      description: 'Complete 50 problems: 10 addition, 10 subtraction, 10 multiplication, 10 division, 10 percentage calculations. Must get 45+ correct. Time limit: 2 hours.',
      type: 'count',
      targetValue: 45,
      timeLimit: 2,
    }
  },

  { 
    id: 'writing-fundamentals-i', 
    name: 'Writing Fundamentals I', 
    baseSkill: 'writing-fundamentals',
    level: 1,
    description: 'Master clear, concise written communication', 
    x: -300, y: 0, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'foundation',
    challenge: {
      title: 'Write 5 different versions of the same message',
      description: 'Pick a simple message (asking for help, giving directions, etc.). Write it 5 ways: formal, casual, persuasive, instructional, and apologetic. Each must be 2-3 sentences.',
      type: 'binary',
      timeLimit: 2,
    }
  },

  { 
    id: 'research-i', 
    name: 'Research I', 
    baseSkill: 'research',
    level: 1,
    description: 'Find and verify reliable information quickly', 
    x: 0, y: 300, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'foundation',
    challenge: {
      title: 'Research and fact-check 10 claims about a controversial topic',
      description: 'Pick a controversial topic. Find 10 claims about it. For each claim, find the original source and rate it as: verified, disputed, or false. Use at least 3 different types of sources.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'digital-literacy-i', 
    name: 'Digital Literacy I', 
    baseSkill: 'digital-literacy',
    level: 1,
    description: 'Master essential digital tools and online safety', 
    x: 0, y: -300, 
    completed: false, 
    prerequisites: ['self-awareness-i'], 
    category: 'foundation',
    challenge: {
      title: 'Set up 5 digital productivity tools and use each for 30 minutes',
      description: 'Set up: password manager, cloud storage, note-taking app, calendar app, and task manager. Spend 30 minutes learning each tool. Create something useful in each.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  // TIER 2 - Building on Foundation
  { 
    id: 'time-management-i', 
    name: 'Time Management I', 
    baseSkill: 'time-management',
    level: 1,
    description: 'Master basic time tracking and prioritization', 
    x: 200, y: -200, 
    completed: false, 
    prerequisites: ['digital-literacy-i'], 
    category: 'foundation',
    challenge: {
      title: 'Track your time in 15-minute blocks for 12 hours today',
      description: 'From 8 AM to 8 PM today, log what you do every 15 minutes. Categories: work, personal, waste, health, learning. Calculate time spent in each category.',
      type: 'binary',
      timeLimit: 12,
    }
  },
  
  { 
    id: 'communication-i', 
    name: 'Communication I', 
    baseSkill: 'communication',
    level: 1,
    description: 'Master active listening and clear expression', 
    x: -200, y: -200, 
    completed: false, 
    prerequisites: ['writing-fundamentals-i'], 
    category: 'social',
    challenge: {
      title: 'Write 3 difficult conversations you need to have, then practice them',
      description: 'Identify 3 difficult conversations you\'ve been avoiding. Write the key points for each. Practice saying them out loud to yourself 3 times each. Record yourself once.',
      type: 'binary',
      timeLimit: 3,
    }
  },
  
  { 
    id: 'goal-setting-i', 
    name: 'Goal Setting I', 
    baseSkill: 'goal-setting',
    level: 1,
    description: 'Learn to set SMART goals and create actionable plans', 
    x: 200, y: 200, 
    completed: false, 
    prerequisites: ['basic-math-i'], 
    category: 'foundation',
    challenge: {
      title: 'Create 3 SMART goals for this week with daily actions',
      description: 'Write 3 goals for this week. Each must be Specific, Measurable, Achievable, Relevant, Time-bound. Break each into daily actions. Include how you\'ll measure success.',
      type: 'binary',
      timeLimit: 2,
    }
  },

  { 
    id: 'critical-thinking-i', 
    name: 'Critical Thinking I', 
    baseSkill: 'critical-thinking',
    level: 1,
    description: 'Analyze information objectively and make better decisions', 
    x: -200, y: 200, 
    completed: false, 
    prerequisites: ['research-i'], 
    category: 'foundation',
    challenge: {
      title: 'Analyze 5 of your recent decisions using a decision framework',
      description: 'Pick 5 decisions you made this month. For each, identify: the problem, options considered, criteria used, information gathered, and outcome. Rate each decision 1-10.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'self-discipline-i', 
    name: 'Self-Discipline I', 
    baseSkill: 'self-discipline',
    level: 1,
    description: 'Build consistent daily habits', 
    x: 0, y: 400, 
    completed: false, 
    prerequisites: ['goal-setting-i'], 
    category: 'leadership',
    challenge: {
      title: 'Complete 4 micro-habits every 2 hours for 10 hours',
      description: 'Set 4 micro-habits: 10 push-ups, drink 1 glass water, write 1 sentence in journal, take 10 deep breaths. Do all 4 every 2 hours from 8 AM to 6 PM (5 rounds total).',
      type: 'count',
      targetValue: 20, // 4 habits x 5 rounds
      timeLimit: 10,
    }
  },

  // TIER 3 - Advanced Foundation
  { 
    id: 'time-management-ii', 
    name: 'Time Management II', 
    baseSkill: 'time-management',
    level: 2,
    description: 'Implement advanced productivity systems', 
    x: 400, y: -200, 
    completed: false, 
    prerequisites: ['time-management-i'], 
    category: 'foundation',
    challenge: {
      title: 'Use Pomodoro technique for 6 hours of focused work',
      description: 'Complete 12 Pomodoro sessions (25 min work, 5 min break) in 6 hours. Track what you accomplish in each session. Must maintain focus - no phone/social media during work blocks.',
      type: 'count',
      targetValue: 12,
      timeLimit: 8,
    }
  },
  
  { 
    id: 'communication-ii', 
    name: 'Communication II', 
    baseSkill: 'communication',
    level: 2,
    description: 'Master difficult conversations and presentations', 
    x: -400, y: -200, 
    completed: false, 
    prerequisites: ['communication-i'], 
    category: 'social',
    challenge: {
      title: 'Create and deliver a 5-minute presentation to your phone camera',
      description: 'Choose a topic you know well. Create a 5-minute presentation with intro, 3 main points, and conclusion. Record yourself delivering it. Watch it back and identify 5 improvements.',
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
    x: 400, y: 200, 
    completed: false, 
    prerequisites: ['goal-setting-i'], 
    category: 'foundation',
    challenge: {
      title: 'Read 25 pages and create a 1-page summary with 10 key points',
      description: 'Choose any non-fiction book. Read 25 pages (about 2 hours). Create a 1-page summary with exactly 10 key points. Include page numbers for each point.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'financial-literacy-i', 
    name: 'Financial Literacy I', 
    baseSkill: 'financial-literacy',
    level: 1,
    description: 'Understand personal finance fundamentals', 
    x: -400, y: 200, 
    completed: false, 
    prerequisites: ['basic-math-i', 'critical-thinking-i'], 
    category: 'foundation',
    challenge: {
      title: 'Calculate your real hourly wage and create a monthly budget',
      description: 'Calculate your true hourly wage (include commute, unpaid overtime, work expenses). Track all expenses for 3 days. Create a monthly budget with 5 categories and savings goal.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  // TIER 4 - Technical Skills Branch
  { 
    id: 'basic-coding-i', 
    name: 'Basic Coding I', 
    baseSkill: 'basic-coding',
    level: 1,
    description: 'Learn fundamental programming concepts', 
    x: 600, y: -200, 
    completed: false, 
    prerequisites: ['digital-literacy-i', 'basic-math-i'], 
    category: 'technical',
    challenge: {
      title: 'Complete 20 coding exercises on a learning platform',
      description: 'Go to Codecademy, freeCodeCamp, or similar. Complete 20 basic exercises covering variables, loops, and functions. Screenshot your progress. Must be consecutive exercises.',
      type: 'count',
      targetValue: 20,
      timeLimit: 6,
    }
  },

  { 
    id: 'basic-coding-ii', 
    name: 'Basic Coding II', 
    baseSkill: 'basic-coding',
    level: 2,
    description: 'Create simple programs with logic', 
    x: 800, y: -200, 
    completed: false, 
    prerequisites: ['basic-coding-i'], 
    category: 'technical',
    challenge: {
      title: 'Build a simple calculator that does 4 operations',
      description: 'Create a calculator program that can add, subtract, multiply, and divide two numbers. Test it with 10 different calculations. Use any programming language.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'web-development-i', 
    name: 'Web Development I', 
    baseSkill: 'web-development',
    level: 1,
    description: 'Build your first webpage', 
    x: 600, y: 0, 
    completed: false, 
    prerequisites: ['basic-coding-i'], 
    category: 'technical',
    challenge: {
      title: 'Create a personal webpage with 5 sections using HTML and CSS',
      description: 'Build a webpage about yourself with: header, about section, skills list, contact info, and footer. Use at least 5 different CSS properties. Make it look professional.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  { 
    id: 'data-analysis-i', 
    name: 'Data Analysis I', 
    baseSkill: 'data-analysis',
    level: 1,
    description: 'Analyze data to find patterns and insights', 
    x: 800, y: 0, 
    completed: false, 
    prerequisites: ['basic-coding-ii', 'basic-math-i'], 
    category: 'technical',
    challenge: {
      title: 'Analyze your phone usage data and create 3 charts',
      description: 'Export your phone usage data for the past week. Create 3 charts: daily usage, top apps, hourly patterns. Draw 3 conclusions about your habits.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  // TIER 4 - Social Skills Branch
  { 
    id: 'networking-i', 
    name: 'Networking I', 
    baseSkill: 'networking',
    level: 1,
    description: 'Build meaningful professional relationships', 
    x: -600, y: -200, 
    completed: false, 
    prerequisites: ['communication-ii'], 
    category: 'social',
    challenge: {
      title: 'Research and create outreach templates for 5 industry professionals',
      description: 'Find 5 professionals in your field on LinkedIn. Research each person. Write personalized message templates for each. Include specific questions about their work. Save as drafts.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'empathy-i', 
    name: 'Empathy I', 
    baseSkill: 'empathy',
    level: 1,
    description: 'Understand and share the feelings of others', 
    x: -600, y: 0, 
    completed: false, 
    prerequisites: ['communication-ii'], 
    category: 'social',
    challenge: {
      title: 'Write 3 perspective analyses of recent conflicts using a structured format',
      description: 'Think of 3 recent disagreements. For each, write: Your perspective (emotions, needs, assumptions), Their likely perspective, Neutral observer view, and One way to bridge the gap.',
      type: 'binary',
      timeLimit: 3,
    }
  },

  { 
    id: 'negotiation-i', 
    name: 'Negotiation I', 
    baseSkill: 'negotiation',
    level: 1,
    description: 'Reach mutually beneficial agreements', 
    x: -800, y: -200, 
    completed: false, 
    prerequisites: ['networking-i', 'empathy-i'], 
    category: 'social',
    challenge: {
      title: 'Research and plan a negotiation strategy for 3 scenarios',
      description: 'Identify 3 things you want to negotiate (salary, price, deadline). For each: research fair market value, identify your BATNA, plan your opening offer, and practice your pitch.',
      type: 'binary',
      timeLimit: 5,
    }
  },

  { 
    id: 'public-speaking-i', 
    name: 'Public Speaking I', 
    baseSkill: 'public-speaking',
    level: 1,
    description: 'Present ideas confidently to groups', 
    x: -800, y: 0, 
    completed: false, 
    prerequisites: ['empathy-i'], 
    category: 'social',
    challenge: {
      title: 'Create and practice a 3-minute speech with gesture choreography',
      description: 'Write a 3-minute speech on a topic you care about. Plan specific gestures for key points. Practice 10 times. Record final version. Speech must have clear intro, body, conclusion.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  // TIER 4 - Creative Skills Branch
  { 
    id: 'creative-thinking-i', 
    name: 'Creative Thinking I', 
    baseSkill: 'creative-thinking',
    level: 1,
    description: 'Generate innovative solutions and ideas', 
    x: -400, y: -400, 
    completed: false, 
    prerequisites: ['critical-thinking-i'], 
    category: 'creative',
    challenge: {
      title: 'Use 3 creativity techniques to solve 1 real problem',
      description: 'Pick a real problem you face. Apply brainstorming (20 ideas in 10 min), SCAMPER method, and reverse thinking. Generate minimum 30 total solutions. Pick top 3 and explain why.',
      type: 'count',
      targetValue: 30,
      timeLimit: 3,
    }
  },

  { 
    id: 'problem-solving-i', 
    name: 'Problem Solving I', 
    baseSkill: 'problem-solving',
    level: 1,
    description: 'Approach challenges systematically', 
    x: 400, y: -400, 
    completed: false, 
    prerequisites: ['reading-i'], 
    category: 'creative',
    challenge: {
      title: 'Solve 3 real problems using the 5 Whys and root cause analysis',
      description: 'Identify 3 recurring problems in your life. For each: ask "why" 5 times, identify root cause, brainstorm 5 solutions, pick 1 solution, and create action plan.',
      type: 'binary',
      timeLimit: 4,
    }
  },

  { 
    id: 'writing-ii', 
    name: 'Writing II', 
    baseSkill: 'writing',
    level: 2,
    description: 'Write compelling and persuasive content', 
    x: -600, y: -400, 
    completed: false, 
    prerequisites: ['creative-thinking-i'], 
    category: 'creative',
    challenge: {
      title: 'Write 3 different 300-word pieces: informative, persuasive, and narrative',
      description: 'Choose one topic. Write 3 versions: informative (teach something), persuasive (convince of viewpoint), narrative (tell a story). Each exactly 300 words. Use different writing techniques.',
      type: 'binary',
      timeLimit: 5,
    }
  },

  { 
    id: 'design-thinking-i', 
    name: 'Design Thinking I', 
    baseSkill: 'design-thinking',
    level: 1,
    description: 'Approach problems with user-centered design', 
    x: 600, y: -400, 
    completed: false, 
    prerequisites: ['problem-solving-i'], 
    category: 'creative',
    challenge: {
      title: 'Complete a 5-step design thinking process for improving something you use daily',
      description: 'Pick something you use daily. Complete: 1) Empathize (interview 2 people), 2) Define (problem statement), 3) Ideate (10 solutions), 4) Prototype (sketch/mockup), 5) Test (get feedback).',
      type: 'binary',
      timeLimit: 8,
    }
  },

  // TIER 5 - Leadership Skills Branch
  { 
    id: 'leadership-i', 
    name: 'Leadership I', 
    baseSkill: 'leadership',
    level: 1,
    description: 'Lead personal projects and initiatives', 
    x: 0, y: 600, 
    completed: false, 
    prerequisites: ['self-discipline-i', 'communication-ii'], 
    category: 'leadership',
    challenge: {
      title: 'Plan and execute a personal project with 5 milestones',
      description: 'Choose a personal project (learn skill, organize space, create something). Create plan with 5 specific milestones. Execute first milestone today. Document progress and lessons learned.',
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
    x: 200, y: 600, 
    completed: false, 
    prerequisites: ['leadership-i', 'time-management-ii'], 
    category: 'leadership',
    challenge: {
      title: 'Create a detailed project plan using project management methodology',
      description: 'Choose a 2-week project. Create: scope statement, WBS, timeline, risk assessment, and success metrics. Use Gantt chart or Kanban board. Include contingency plans.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  { 
    id: 'team-building-i', 
    name: 'Team Building I', 
    baseSkill: 'team-building',
    level: 1,
    description: 'Build cohesive and effective teams', 
    x: -200, y: 600, 
    completed: false, 
    prerequisites: ['leadership-i', 'empathy-i'], 
    category: 'leadership',
    challenge: {
      title: 'Design a team building activity and create implementation guide',
      description: 'Design a team building activity for 4-8 people. Create detailed guide: objectives, materials needed, step-by-step instructions, timing, and debrief questions. Test logistics yourself.',
      type: 'binary',
      timeLimit: 5,
    }
  },

  { 
    id: 'health-optimization-i', 
    name: 'Health Optimization I', 
    baseSkill: 'health-optimization',
    level: 1,
    description: 'Optimize physical and mental health', 
    x: 400, y: 600, 
    completed: false, 
    prerequisites: ['self-discipline-i', 'data-analysis-i'], 
    category: 'foundation',
    challenge: {
      title: 'Create and test a personalized daily health routine',
      description: 'Design a daily routine with: 20min exercise, meal plan, sleep schedule, stress management. Execute for 12 hours today. Track energy levels hourly (1-10 scale). Adjust based on results.',
      type: 'binary',
      timeLimit: 12,
    }
  },

  // TIER 6 - Mastery Skills
  { 
    id: 'strategic-thinking-i', 
    name: 'Strategic Thinking I', 
    baseSkill: 'strategic-thinking',
    level: 1,
    description: 'Think long-term and plan strategically', 
    x: 0, y: 800, 
    completed: false, 
    prerequisites: ['project-management-i', 'team-building-i'], 
    category: 'leadership',
    challenge: {
      title: 'Create a strategic analysis using SWOT and scenario planning',
      description: 'Choose a major decision you face. Complete SWOT analysis (strengths, weaknesses, opportunities, threats). Create 3 scenarios (best, worst, most likely). Develop strategy for each.',
      type: 'binary',
      timeLimit: 6,
    }
  },

  { 
    id: 'innovation-i', 
    name: 'Innovation I', 
    baseSkill: 'innovation',
    level: 1,
    description: 'Create novel solutions to problems', 
    x: 400, y: 800, 
    completed: false, 
    prerequisites: ['design-thinking-i', 'creative-thinking-i'], 
    category: 'creative',
    challenge: {
      title: 'Combine 2 existing solutions to create 1 new solution',
      description: 'Find 2 existing solutions from different industries that solve similar problems. Combine their best features to create a new solution. Create mockup/prototype and test feasibility.',
      type: 'binary',
      timeLimit: 8,
    }
  },

  { 
    id: 'systems-thinking-i', 
    name: 'Systems Thinking I', 
    baseSkill: 'systems-thinking',
    level: 1,
    description: 'Understand complex interconnected systems', 
    x: -400, y: 800, 
    completed: false, 
    prerequisites: ['strategic-thinking-i'], 
    category: 'foundation',
    challenge: {
      title: 'Map a complex system with 20 interconnections',
      description: 'Choose a complex system (your morning routine, your workplace, social media). Map all components and draw 20 specific connections between them. Identify 3 leverage points.',
      type: 'count',
      targetValue: 20,
      timeLimit: 5,
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