'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Target, Trash2, Edit, Play, Check, AlertCircle, X } from 'lucide-react'
import ChallengeModal from './ChallengeModal'

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

export default function ChallengeTracker() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges')
      const data = await response.json()
      setChallenges(data)
    } catch (error) {
      console.error('Error fetching challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteChallenge = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      await fetch(`/api/challenges/${id}`, { method: 'DELETE' })
      setChallenges(challenges.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting challenge:', error)
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
    // Completed challenges go to bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    
    // Sort by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    
    // Sort by deadline
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    if (a.deadline) return -1
    if (b.deadline) return 1
    
    return 0
  })

  const categories = [...new Set(challenges.map(c => c.category))]
  const activeChallenges = challenges.filter(c => !c.completed)
  const completedChallenges = challenges.filter(c => c.completed)
  const inProgressChallenges = challenges.filter(c => !c.completed && c.progress > 0)
  const overdueChallenges = challenges.filter(c => !c.completed && c.deadline && getDaysUntilDeadline(c.deadline)! < 0)

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading challenges...</div>
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
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-gray-300 hover:text-white"
        >
          <Plus size={20} />
          <span>Add New Challenge</span>
        </button>
      </div>

      {/* Challenge List */}
      <div className="space-y-4">
        {sortedChallenges.map(challenge => (
          <div key={challenge.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    challenge.priority === 'high' ? 'bg-red-600 text-white' :
                    challenge.priority === 'medium' ? 'bg-yellow-600 text-white' :
                    'bg-green-600 text-white'
                  }`}>
                    {challenge.priority}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                    {challenge.category}
                  </span>
                  {challenge.completed && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                      <Check size={12} className="inline mr-1" />
                      Completed
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 mb-3">{challenge.description}</p>
                
                {/* Progress Bar */}
                {(challenge.type === 'count' || challenge.type === 'checklist') && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(challenge)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(challenge)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Challenge Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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
                  
                  {challenge.completedAt && (
                    <div className="flex items-center gap-1 text-green-400">
                      <Check size={16} />
                      <span>Completed {new Date(challenge.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 ml-4">
                {!challenge.completed && (
                  <button
                    onClick={() => {
                      setSelectedChallenge(challenge)
                      setShowModal(true)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                  >
                    <Play size={14} />
                    {challenge.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                )}
                
                <button
                  onClick={() => deleteChallenge(challenge.id)}
                  className="text-red-400 hover:text-red-300 p-1 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedChallenges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            {filter === 'all' ? 'No challenges found' : 
             filter === 'active' ? 'No active challenges' : 
             'No completed challenges'}
          </div>
          {filter === 'all' && (
            <p className="text-gray-500 mb-6">Create your first challenge to get started on your journey</p>
          )}
        </div>
      )}

      {/* Challenge Modal */}
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedChallenge(null)
            fetchChallenges()
          }}
        />
      )}

      {/* Add Challenge Modal */}
      {showAddForm && (
        <AddChallengeModal
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            fetchChallenges()
          }}
        />
      )}
    </div>
  )
}

interface AddChallengeModalProps {
  onClose: () => void
  onSuccess: () => void
}

function AddChallengeModal({ onClose, onSuccess }: AddChallengeModalProps) {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        targetValue: formData.targetValue ? parseInt(formData.targetValue) : null,
        timeLimit: formData.timeLimit ? parseInt(formData.timeLimit) : null,
        deadline: formData.deadline || null,
        checklistItems: formData.type === 'checklist' ? 
          JSON.stringify(formData.checklistItems.split('\n').filter(item => item.trim())) : null
      }

      await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      onSuccess()
    } catch (error) {
      console.error('Error creating challenge:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Add New Challenge</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Challenge title..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your challenge..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="binary">Binary (Done/Not Done)</option>
                <option value="count">Count-based</option>
                <option value="time">Time-based</option>
                <option value="checklist">Checklist</option>
              </select>

              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Category (e.g., health, work)"
                className="px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />

              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {(formData.type === 'count' || formData.type === 'time') && (
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                placeholder={formData.type === 'time' ? 'Target minutes' : 'Target count'}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="1"
                required
              />
            )}

            <input
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData({...formData, timeLimit: e.target.value})}
              placeholder="Time limit (hours, optional)"
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
            />

            {formData.type === 'checklist' && (
              <textarea
                value={formData.checklistItems}
                onChange={(e) => setFormData({...formData, checklistItems: e.target.value})}
                placeholder="Enter checklist items (one per line)"
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
                required
              />
            )}

            <div className="flex space-x-2 pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Check size={16} />
                <span>Add Challenge</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 