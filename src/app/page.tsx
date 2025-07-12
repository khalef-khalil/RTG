'use client'

import Navigation from './components/Navigation'
import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: string
  targetValue?: number
  deadline?: string
  timeLimit?: number
  priority: string
  category: string
  completed: boolean
  completedAt?: string
  progress: number
  checklistItems?: string
  biggestObstacle?: string
  improvement?: string
  pushRating?: number
  createdAt: string
  updatedAt: string
}

interface Principle {
  id: string
  text: string
  type: string
  category: string
  source?: string
  createdAt: string
  updatedAt: string
}

interface FocusItem {
  id: string
  text: string
  type: string
  category: string
  source?: string
  createdAt: string
  updatedAt: string
}

interface System {
  id: string
  trigger: string
  action: string
  outcome: string
  category: string
  source?: string
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async () => {
    setIsExporting(true)
    try {
      // Fetch all data from the API
      const [challengesRes, principlesRes, focusRes, systemsRes] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/principles'),
        fetch('/api/focus'),
        fetch('/api/systems')
      ])

      const challenges: Challenge[] = await challengesRes.json()
      const principles: Principle[] = await principlesRes.json()
      const focusItems: FocusItem[] = await focusRes.json()
      const systems: System[] = await systemsRes.json()

      // Create the comprehensive export text
      const exportText = createExportText(challenges, principles, focusItems, systems)
      
      // Create and download the file
      const blob = new Blob([exportText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rtg-export-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const createExportText = (challenges: Challenge[], principles: Principle[], focusItems: FocusItem[], systems: System[]) => {
    const completedChallenges = challenges.filter(c => c.completed)
    const activeChallenges = challenges.filter(c => !c.completed)
    
    return `ROAD TO GREATNESS - PERSONAL DEVELOPMENT DATA EXPORT
Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}

================================================================================
PREMISE & CONTEXT
================================================================================

This is a comprehensive personal development system called "Road to Greatness" (RTG). 
The user has been tracking their personal growth across four key areas:

1. CHALLENGES: Personal goals and objectives with progress tracking
2. PRINCIPLES: Life wisdom and rules (do's and don'ts) 
3. FOCUS: What matters vs. what doesn't matter in their life
4. SYSTEMS: Automated behavioral responses to common situations

The data below represents their current state, completed achievements, and ongoing efforts.

================================================================================
CHALLENGES DATA
================================================================================

ACTIVE CHALLENGES (${activeChallenges.length}):
${activeChallenges.map(c => `- ${c.title} (${c.type}, ${c.priority} priority, ${c.category})
  Description: ${c.description}
  Progress: ${c.progress}${c.targetValue ? `/${c.targetValue}` : ''}
  ${c.deadline ? `Deadline: ${new Date(c.deadline).toLocaleDateString()}` : 'No deadline'}
`).join('\n')}

COMPLETED CHALLENGES (${completedChallenges.length}):
${completedChallenges.map(c => `- ${c.title} (${c.type}, ${c.category})
  Completed: ${c.completedAt ? new Date(c.completedAt).toLocaleDateString() : 'Unknown'}
  ${c.biggestObstacle ? `Biggest Obstacle: ${c.biggestObstacle}` : ''}
  ${c.improvement ? `What to improve: ${c.improvement}` : ''}
  ${c.pushRating ? `Push Rating: ${c.pushRating}/5` : ''}
`).join('\n')}

CHALLENGE STATISTICS:
- Total Challenges: ${challenges.length}
- Completion Rate: ${challenges.length > 0 ? Math.round((completedChallenges.length / challenges.length) * 100) : 0}%
- Average Push Rating: ${completedChallenges.length > 0 ? Math.round(completedChallenges.reduce((sum, c) => sum + (c.pushRating || 0), 0) / completedChallenges.length) : 0}/5

================================================================================
PRINCIPLES DATA
================================================================================

LIFE PRINCIPLES (${principles.length} total):

DO'S (${principles.filter(p => p.type === 'do').length}):
${principles.filter(p => p.type === 'do').map(p => `- ${p.text} (${p.category})${p.source ? ` - Source: ${p.source}` : ''}`).join('\n')}

DON'TS (${principles.filter(p => p.type === 'dont').length}):
${principles.filter(p => p.type === 'dont').map(p => `- ${p.text} (${p.category})${p.source ? ` - Source: ${p.source}` : ''}`).join('\n')}

PRINCIPLE CATEGORIES:
${Array.from(new Set(principles.map(p => p.category))).map(cat => `- ${cat}: ${principles.filter(p => p.category === cat).length} principles`).join('\n')}

================================================================================
FOCUS DATA
================================================================================

FOCUS AREAS (${focusItems.length} total):

MATTERS (${focusItems.filter(f => f.type === 'matters').length}):
${focusItems.filter(f => f.type === 'matters').map(f => `- ${f.text} (${f.category})${f.source ? ` - Source: ${f.source}` : ''}`).join('\n')}

DOESN'T MATTER (${focusItems.filter(f => f.type === 'doesnt_matter').length}):
${focusItems.filter(f => f.type === 'doesnt_matter').map(f => `- ${f.text} (${f.category})${f.source ? ` - Source: ${f.source}` : ''}`).join('\n')}

FOCUS CATEGORIES:
${Array.from(new Set(focusItems.map(f => f.category))).map(cat => `- ${cat}: ${focusItems.filter(f => f.category === cat).length} items`).join('\n')}

================================================================================
SYSTEMS DATA
================================================================================

AUTOMATED SYSTEMS (${systems.length} total):
${systems.map(s => `- TRIGGER: ${s.trigger}
  ACTION: ${s.action}
  OUTCOME: ${s.outcome}
  Category: ${s.category}${s.source ? ` - Source: ${s.source}` : ''}
`).join('\n')}

SYSTEM CATEGORIES:
${Array.from(new Set(systems.map(s => s.category))).map(cat => `- ${cat}: ${systems.filter(s => s.category === cat).length} systems`).join('\n')}

================================================================================
LLM ANALYSIS REQUEST
================================================================================

Based on the comprehensive personal development data above, please provide:

1. CHARACTER ANALYSIS: From an objective perspective, analyze the user's character, values, and personal development approach. Consider:
   - Their priorities and what they focus on
   - Their principles and moral framework
   - Their approach to challenges and growth
   - Their systematic thinking and automation preferences
   - Patterns in their completed challenges and obstacles faced

2. STRENGTHS IDENTIFICATION: What are their apparent strengths based on this data?

3. GROWTH AREAS: What areas might they be neglecting or could improve?

4. SINGLE RECOMMENDATION: Propose exactly ONE specific addition to their system:
   - It could be a new principle, focus area, system, or challenge
   - Make it specific, actionable, and tailored to their current state
   - Explain why this particular addition would be valuable for them
   - Consider their current patterns and what might complement their existing framework

Please be objective, constructive, and specific in your analysis. Focus on actionable insights that can help them continue their road to greatness.

================================================================================
END OF EXPORT
================================================================================`
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 max-w-4xl mx-auto p-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Road to Greatness
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your journey to personal excellence starts here. Take on challenges, clarify your focus, 
            build automated systems, and live by proven principles.
          </p>
          
          {/* Export Button */}
          <div className="flex justify-center">
            <button
              onClick={exportData}
              disabled={isExporting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-lg font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Export Data for LLM Analysis</span>
                </>
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Export all your data as a comprehensive prompt for AI analysis and personalized recommendations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center mt-8 max-w-4xl mx-auto">
            <a
              href="/challenges"
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Start Your Challenges</span>
            </a>
            <a
              href="/focus"
              className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Clarify Your Focus</span>
            </a>
            <a
              href="/systems"
              className="flex items-center space-x-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Build Your Systems</span>
            </a>
            <a
              href="/principles"
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Explore Principles</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
