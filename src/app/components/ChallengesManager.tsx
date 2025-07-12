'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Check, X, Calendar, Clock, Target, Loader2 } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: 'count' | 'time' | 'binary' | 'checklist'
  targetValue?: number
  deadline?: string
  timeLimit?: number
  priority: 'low' | 'medium' | 'high'
  category: string
  completed: boolean
  completedAt?: string
  progress: number
  checklistItems?: string
  createdAt: string
  updatedAt: string
}

const priorityOrder = { high: 3, medium: 2, low: 1 }

export default function ChallengesManager() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'binary' as 'count' | 'time' | 'binary' | 'checklist',
    targetValue: '',
    deadline: '',
    timeLimit: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: '',
    checklistItems: ''
  })

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        setChallenges(data)
      } else {
        console.error('Error fetching challenges:', data.error || 'Invalid response format')
        setChallenges([])
      }
    } catch (error) {
      console.error('Error fetching challenges:', error)
      setChallenges([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddChallenge = async () => {
    if (newChallenge.title.trim() && newChallenge.description.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const payload = {
          ...newChallenge,
          targetValue: newChallenge.targetValue ? parseInt(newChallenge.targetValue) : null,
          timeLimit: newChallenge.timeLimit ? parseInt(newChallenge.timeLimit) : null,
          deadline: newChallenge.deadline || null,
          checklistItems: newChallenge.type === 'checklist' ? 
            JSON.stringify(newChallenge.checklistItems.split('\n').filter(item => item.trim())) : null
        }

        const response = await fetch('/api/challenges', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          await fetchChallenges()
          setNewChallenge({
            title: '',
            description: '',
            type: 'binary',
            targetValue: '',
            deadline: '',
            timeLimit: '',
            priority: 'medium',
            category: '',
            checklistItems: ''
          })
          setIsAdding(false)
        }
      } catch (error) {
        console.error('Error creating challenge:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditChallenge = async (id: string, updatedData: Partial<Challenge>) => {
    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      
      if (response.ok) {
        await fetchChallenges()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to edit challenge:', error)
    }
  }

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      const response = await fetch(`/api/challenges/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchChallenges()
      }
    } catch (error) {
      console.error('Failed to delete challenge:', error)
    }
  }

  const [completingChallenge, setCompletingChallenge] = useState<Challenge | null>(null)
  const [completionData, setCompletionData] = useState({
    biggestObstacle: '',
    improvement: '',
    pushRating: 3
  })

  const handleCompleteChallenge = async (id: string) => {
    const challenge = challenges.find(c => c.id === id)
    if (!challenge) return
    
    setCompletingChallenge(challenge)
    setCompletionData({
      biggestObstacle: '',
      improvement: '',
      pushRating: 3
    })
  }

  const handleSubmitCompletion = async () => {
    if (!completingChallenge) return

    try {
      const response = await fetch(`/api/challenges/${completingChallenge.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          completed: true, 
          progress: completingChallenge.targetValue || completingChallenge.progress,
          completedAt: new Date().toISOString(),
          biggestObstacle: completionData.biggestObstacle.trim() || null,
          improvement: completionData.improvement.trim() || null,
          pushRating: completionData.pushRating
        })
      })

      if (response.ok) {
        await fetchChallenges()
        setCompletingChallenge(null)
      }
    } catch (error) {
      console.error('Failed to complete challenge:', error)
    }
  }

  const getDaysUntilDeadline = (deadline?: string) => {
    if (!deadline) return null
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDeadlineColor = (deadline?: string) => {
    const days = getDaysUntilDeadline(deadline)
    if (days === null) return 'text-gray-400'
    if (days < 0) return 'text-red-400'
    if (days <= 1) return 'text-orange-400'
    if (days <= 3) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getProgressPercentage = (challenge: Challenge) => {
    if (challenge.completed) return 100
    if (challenge.type === 'binary') return 0
    if (challenge.type === 'checklist' && challenge.checklistItems) {
      const items = JSON.parse(challenge.checklistItems)
      return Math.round((challenge.progress / items.length) * 100)
    }
    if (challenge.targetValue) {
      return Math.min(Math.round((challenge.progress / challenge.targetValue) * 100), 100)
    }
    return 0
  }

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'active' && challenge.completed) return false
    if (filter === 'completed' && !challenge.completed) return false
    if (categoryFilter !== 'all' && challenge.category !== categoryFilter) return false
    if (priorityFilter !== 'all' && challenge.priority !== priorityFilter) return false
    return true
  })

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (a.deadline) return -1
    if (b.deadline) return 1
    return 0
  })

  const categories = [...new Set(challenges.map(c => c.category))]
  // const activeChallenges = challenges.filter(c => !c.completed)
  const completedChallenges = challenges.filter(c => c.completed)
  const inProgressChallenges = challenges.filter(c => !c.completed && c.progress > 0)
  const overdueChallenges = challenges.filter(c => !c.completed && c.deadline && getDaysUntilDeadline(c.deadline)! < 0)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 size={24} className="animate-spin text-purple-400" />
          <span className="text-white text-lg">Loading challenges...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Challenge Tracker
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Track your progress, meet deadlines, and achieve your goals one challenge at a time.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{challenges.length}</div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedChallenges.length}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{inProgressChallenges.length}</div>
            <div className="text-sm text-gray-400">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{overdueChallenges.length}</div>
            <div className="text-sm text-gray-400">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'active' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'completed' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 pr-10 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg appearance-none cursor-pointer"
            >
              <option value="all">🌟 All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800 text-white">
                  📂 {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 pr-10 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg appearance-none cursor-pointer"
            >
              <option value="all">⚡ All Priorities</option>
              <option value="high" className="bg-gray-800 text-white">🔥 High</option>
              <option value="medium" className="bg-gray-800 text-white">⚠️ Medium</option>
              <option value="low" className="bg-gray-800 text-white">📝 Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Challenge */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-gray-300 hover:text-white"
          >
            <Plus size={20} />
            <span>Add New Challenge</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                placeholder="Challenge title..."
                className="px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                value={newChallenge.category}
                onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                placeholder="Category (e.g., health, work)"
                className="px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <textarea
              value={newChallenge.description}
              onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
              placeholder="Describe your challenge..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={newChallenge.type}
                onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value as any })}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="binary">Binary (Done/Not Done)</option>
                <option value="count">Count-based</option>
                <option value="time">Time-based</option>
                <option value="checklist">Checklist</option>
              </select>

              <select
                value={newChallenge.priority}
                onChange={(e) => setNewChallenge({ ...newChallenge, priority: e.target.value as any })}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <input
                type="date"
                value={newChallenge.deadline}
                onChange={(e) => setNewChallenge({ ...newChallenge, deadline: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(newChallenge.type === 'count' || newChallenge.type === 'time') && (
                <input
                  type="number"
                  value={newChallenge.targetValue}
                  onChange={(e) => setNewChallenge({ ...newChallenge, targetValue: e.target.value })}
                  placeholder={newChallenge.type === 'time' ? 'Target minutes' : 'Target count'}
                  className="px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="1"
                />
              )}

              <input
                type="number"
                value={newChallenge.timeLimit}
                onChange={(e) => setNewChallenge({ ...newChallenge, timeLimit: e.target.value })}
                placeholder="Time limit (hours, optional)"
                className="px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
              />
            </div>

            {newChallenge.type === 'checklist' && (
              <textarea
                value={newChallenge.checklistItems}
                onChange={(e) => setNewChallenge({ ...newChallenge, checklistItems: e.target.value })}
                placeholder="Enter checklist items (one per line)"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
              />
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleAddChallenge}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Add Challenge</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewChallenge({
                    title: '',
                    description: '',
                    type: 'binary',
                    targetValue: '',
                    deadline: '',
                    timeLimit: '',
                    priority: 'medium',
                    category: '',
                    checklistItems: ''
                  })
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Challenges List */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {sortedChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isEditing={editingId === challenge.id}
            onEdit={(updatedData) => handleEditChallenge(challenge.id, updatedData)}
            onDelete={() => handleDeleteChallenge(challenge.id)}
            onComplete={() => handleCompleteChallenge(challenge.id)}
            onStartEdit={() => setEditingId(challenge.id)}
            onCancelEdit={() => setEditingId(null)}
            getDaysUntilDeadline={getDaysUntilDeadline}
            getDeadlineColor={getDeadlineColor}
            getProgressPercentage={getProgressPercentage}
          />
        ))}
      </div>

      {sortedChallenges.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No challenges found matching your filters.</p>
        </div>
      )}

      {/* Completion Modal */}
      {completingChallenge && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-md w-full border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Challenge Complete! 🎉</h2>
                <button
                  onClick={() => setCompletingChallenge(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">{completingChallenge.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">Let's capture some quick insights about this challenge:</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What was the biggest obstacle? (3-4 words)
                  </label>
                  <input
                    type="text"
                    value={completionData.biggestObstacle}
                    onChange={(e) => setCompletionData({ ...completionData, biggestObstacle: e.target.value })}
                    placeholder="e.g., time management, motivation, distractions"
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What would you do differently? (one sentence)
                  </label>
                  <input
                    type="text"
                    value={completionData.improvement}
                    onChange={(e) => setCompletionData({ ...completionData, improvement: e.target.value })}
                    placeholder="e.g., Start earlier in the day, break it into smaller steps"
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    How much did this push you? (1-5 scale)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setCompletionData({ ...completionData, pushRating: rating })}
                        className={`w-10 h-10 rounded-full border-2 transition-colors ${
                          completionData.pushRating === rating
                            ? 'bg-purple-600 border-purple-600 text-white'
                            : 'border-gray-600 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    1 = Easy • 5 = Really pushed my limits
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={handleSubmitCompletion}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Complete Challenge
                  </button>
                  <button
                    onClick={() => setCompletingChallenge(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface ChallengeCardProps {
  challenge: Challenge
  isEditing: boolean
  onEdit: (updatedData: Partial<Challenge>) => void
  onDelete: () => void
  onComplete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  getDaysUntilDeadline: (deadline?: string) => number | null
  getDeadlineColor: (deadline?: string) => string
  getProgressPercentage: (challenge: Challenge) => number
}

function ChallengeCard({ 
  challenge, 
  isEditing, 
  onEdit, 
  onDelete, 
  onComplete, 
  onStartEdit, 
  onCancelEdit,
  getDaysUntilDeadline,
  getDeadlineColor,
  getProgressPercentage
}: ChallengeCardProps) {
  const [editData, setEditData] = useState({
    title: challenge.title,
    description: challenge.description
  })

  // Parse checklist items and track checked state
  const [checklistItems, setChecklistItems] = useState<string[]>(() => {
    if (challenge.type === 'checklist' && challenge.checklistItems) {
      const items = JSON.parse(challenge.checklistItems)
      // Handle both old format (array of strings) and new format (array of objects)
      if (Array.isArray(items)) {
        if (items.length > 0 && typeof items[0] === 'object' && 'text' in items[0]) {
          // New format: array of objects with text and checked properties
          return items.map((item: any) => item.text)
        } else {
          // Old format: array of strings
          return items
        }
      }
    }
    return []
  })
  
  // Initialize checked items based on progress
  const [checkedItems, setCheckedItems] = useState<boolean[]>(() => {
    if (challenge.type === 'checklist' && challenge.checklistItems) {
      const items = JSON.parse(challenge.checklistItems)
      // Handle both old format (array of strings) and new format (array of objects)
      if (Array.isArray(items)) {
        if (items.length > 0 && typeof items[0] === 'object' && 'text' in items[0]) {
          // New format: array of objects with text and checked properties
          return items.map((item: any) => item.checked || false)
        } else {
          // Old format: array of strings
          return items.map((_: string, index: number) => index < challenge.progress)
        }
      }
    }
    return []
  })

  // Update checked items when challenge changes
  useEffect(() => {
    if (challenge.type === 'checklist' && challenge.checklistItems) {
      const items = JSON.parse(challenge.checklistItems)
      
      // Handle both old format (array of strings) and new format (array of objects)
      if (Array.isArray(items)) {
        if (items.length > 0 && typeof items[0] === 'object' && 'text' in items[0]) {
          // New format: array of objects with text and checked properties
          setChecklistItems(items.map((item: any) => item.text))
          setCheckedItems(items.map((item: any) => item.checked || false))
        } else {
          // Old format: array of strings
          setChecklistItems(items)
          setCheckedItems(items.map((_: string, index: number) => index < challenge.progress))
        }
      }
    } else {
      // Reset if no checklist items
      setChecklistItems([])
      setCheckedItems([])
    }
  }, [challenge.checklistItems, challenge.type, challenge.progress])

  const handleChecklistItemChange = (index: number, checked: boolean) => {
    const newCheckedItems = [...checkedItems]
    newCheckedItems[index] = checked
    setCheckedItems(newCheckedItems)
    
    // Update progress based on checked items
    const newProgress = newCheckedItems.filter(item => item).length
    
    // Create updated checklist items with checked state
    const updatedChecklistItems = checklistItems.map((item: string, i: number) => ({
      text: item,
      checked: newCheckedItems[i] || false
    }))
    
    onEdit({ 
      progress: newProgress,
      checklistItems: JSON.stringify(updatedChecklistItems)
    })
  }

  const handleSave = () => {
    if (editData.title.trim() && editData.description.trim()) {
      onEdit(editData)
    }
  }

  // Calculate progress percentage based on current checked items for checklist type
  const progressPercentage = challenge.type === 'checklist' 
    ? Math.round((checkedItems.filter(item => item).length / checklistItems.length) * 100)
    : getProgressPercentage(challenge)

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      challenge.completed 
        ? 'bg-green-900/20 border-green-500/30' 
        : challenge.priority === 'high' 
        ? 'bg-red-900/20 border-red-500/30'
        : challenge.priority === 'medium'
        ? 'bg-yellow-900/20 border-yellow-500/30'
        : 'bg-blue-900/20 border-blue-500/30'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${
            challenge.completed 
              ? 'bg-green-500/20 text-green-300'
              : challenge.priority === 'high' 
              ? 'bg-red-500/20 text-red-300'
              : challenge.priority === 'medium'
              ? 'bg-yellow-500/20 text-yellow-300'
              : 'bg-blue-500/20 text-blue-300'
          }`}>
            {challenge.priority}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-300">
            {challenge.category}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
            {challenge.type}
          </span>
        </div>
        
        <div className="flex space-x-1">
          {!challenge.completed && (
            <button
              onClick={onComplete}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Mark as completed"
            >
              <Check size={14} className="text-green-400 hover:text-green-300" />
            </button>
          )}
          <button
            onClick={onStartEdit}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <Edit3 size={14} className="text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-white" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            >
              <Check size={12} />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setEditData({ title: challenge.title, description: challenge.description })
                onCancelEdit()
              }}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
            >
              <X size={12} />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
          <p className="text-gray-300 mb-3 leading-relaxed">{challenge.description}</p>
          
          {/* Progress Bar */}
          {(challenge.type === 'count' || challenge.type === 'checklist') && (
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Checklist Items */}
          {challenge.type === 'checklist' && checklistItems.length > 0 && (
            <div className="mb-3">
              <div className="text-sm text-gray-400 mb-2">Checklist Items:</div>
              <div className="space-y-2">
                {checklistItems.map((item: string, index: number) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems[index] || false}
                      onChange={(e) => handleChecklistItemChange(index, e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className={`text-sm ${checkedItems[index] ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Challenge Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Target size={16} />
              <span>{challenge.type}</span>
              {challenge.targetValue && (
                <span>({challenge.progress}/{challenge.targetValue})</span>
              )}
            </div>
            
            {challenge.deadline && (
              <div className={`flex items-center gap-1 ${getDeadlineColor(challenge.deadline)}`}>
                <Calendar size={16} />
                <span>
                  {new Date(challenge.deadline).toLocaleDateString()}
                  {getDaysUntilDeadline(challenge.deadline) !== null && (
                    <span className="ml-1">
                      ({getDaysUntilDeadline(challenge.deadline)! < 0 ? 'overdue' : 
                        `${getDaysUntilDeadline(challenge.deadline)} days left`})
                    </span>
                  )}
                </span>
              </div>
            )}
            
            {challenge.timeLimit && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{challenge.timeLimit}h limit</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Created {new Date(challenge.createdAt).toLocaleDateString()}</span>
            {challenge.completedAt && (
              <span className="text-green-400">
                Completed {new Date(challenge.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
} 