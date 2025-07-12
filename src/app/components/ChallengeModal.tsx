'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Target, CheckCircle, Play, Trophy, Calendar, Check } from 'lucide-react'

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

interface ChallengeModalProps {
  challenge: Challenge
  isOpen: boolean
  onClose: () => void
}

const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
}

export default function ChallengeModal({ challenge, isOpen, onClose }: ChallengeModalProps) {
  const [challengeStarted, setChallengeStarted] = useState(false)
  const [challengeProgress, setChallengeProgress] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [checklistState, setChecklistState] = useState<boolean[]>([])

  useEffect(() => {
    if (challenge) {
      setChallengeProgress(challenge.progress)
      setChallengeStarted(challenge.progress > 0)
      
      // Initialize checklist state
      if (challenge.type === 'checklist' && challenge.checklistItems) {
        const items = JSON.parse(challenge.checklistItems)
        const initialState = new Array(items.length).fill(false)
        // Set checked items based on progress
        for (let i = 0; i < challenge.progress; i++) {
          initialState[i] = true
        }
        setChecklistState(initialState)
      }
    }
  }, [challenge])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (challengeStarted && startTime && !challenge.completed) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [challengeStarted, startTime, challenge.completed])

  if (!isOpen || !challenge) return null

  const handleStartChallenge = () => {
    setChallengeStarted(true)
    setStartTime(new Date())
    setElapsedTime(0)
  }

  const handleProgressUpdate = (newProgress: number) => {
    setChallengeProgress(newProgress)
    // Auto-save progress
    updateChallengeProgress(newProgress)
  }

  const handleChecklistToggle = (index: number) => {
    const newState = [...checklistState]
    newState[index] = !newState[index]
    setChecklistState(newState)
    
    const checkedCount = newState.filter(Boolean).length
    setChallengeProgress(checkedCount)
    updateChallengeProgress(checkedCount)
  }

  const updateChallengeProgress = async (progress: number) => {
    try {
      await fetch(`/api/challenges/${challenge.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress })
      })
    } catch (error) {
      console.error('Failed to update progress:', error)
    }
  }

  const handleCompleteChallenge = async () => {
    setIsCompleting(true)
    try {
      const response = await fetch(`/api/challenges/${challenge.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          completed: true, 
          progress: challenge.targetValue || challengeProgress,
          completedAt: new Date().toISOString()
        })
      })

      if (response.ok) {
        onClose()
      }
    } catch (error) {
      console.error('Failed to complete challenge:', error)
    } finally {
      setIsCompleting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getProgressPercentage = () => {
    if (challenge.type === 'count' && challenge.targetValue) {
      return Math.min((challengeProgress / challenge.targetValue) * 100, 100)
    }
    if (challenge.type === 'checklist' && challenge.checklistItems) {
      const items = JSON.parse(challenge.checklistItems)
      return Math.min((challengeProgress / items.length) * 100, 100)
    }
    return challengeProgress
  }

  const isTimeExceeded = () => {
    if (!challenge.timeLimit || !startTime) return false
    const timeLimit = challenge.timeLimit * 3600 // Convert hours to seconds
    return elapsedTime > timeLimit
  }

  const getTimeRemaining = () => {
    if (!challenge.timeLimit || !startTime) return null
    const timeLimit = challenge.timeLimit * 3600
    const remaining = timeLimit - elapsedTime
    return remaining > 0 ? remaining : 0
  }

  const getDaysUntilDeadline = () => {
    if (!challenge.deadline) return null
    const now = new Date()
    const deadlineDate = new Date(challenge.deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDeadlineColor = () => {
    const days = getDaysUntilDeadline()
    if (days === null) return 'text-gray-400'
    if (days < 0) return 'text-red-400'
    if (days <= 1) return 'text-orange-400'
    if (days <= 3) return 'text-yellow-400'
    return 'text-green-400'
  }

  const canComplete = () => {
    if (challenge.type === 'binary') return challengeStarted
    if (challenge.type === 'count') return challengeProgress >= (challenge.targetValue || 0)
    if (challenge.type === 'time') return challengeProgress >= (challenge.targetValue || 0)
    if (challenge.type === 'checklist') {
      const items = JSON.parse(challenge.checklistItems || '[]')
      return challengeProgress >= items.length
    }
    return false
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: priorityColors[challenge.priority] }}
            />
            <h2 className="text-2xl font-bold text-white">
              {challenge.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Challenge Content */}
        <div className="p-6 space-y-6">
          {/* Challenge Info */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-yellow-400">Challenge Details</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                challenge.priority === 'high' ? 'bg-red-100 text-red-800' :
                challenge.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {challenge.priority} priority
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Target size={16} />
                <span>Type: {challenge.type}</span>
              </div>
              {challenge.timeLimit && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock size={16} />
                  <span>Time Limit: {challenge.timeLimit}h</span>
                </div>
              )}
              {challenge.targetValue && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Trophy size={16} />
                  <span>Target: {challenge.targetValue}</span>
                </div>
              )}
              {challenge.deadline && (
                <div className={`flex items-center space-x-2 ${getDeadlineColor()}`}>
                  <Calendar size={16} />
                  <span>
                    Due: {new Date(challenge.deadline).toLocaleDateString()}
                    {getDaysUntilDeadline() !== null && (
                      <span className="ml-1">
                        ({getDaysUntilDeadline()! < 0 ? 'overdue' : 
                          `${getDaysUntilDeadline()} days left`})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Timer Section */}
          {challengeStarted && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-400">Timer</h3>
                {isTimeExceeded() && (
                  <span className="text-red-400 text-sm font-medium">Time Exceeded!</span>
                )}
              </div>
              <div className="text-2xl font-mono text-white mb-2">
                {formatTime(elapsedTime)}
              </div>
              {challenge.timeLimit && (
                <div className="text-sm text-gray-400">
                  Time Remaining: {getTimeRemaining() !== null ? formatTime(getTimeRemaining()!) : 'N/A'}
                </div>
              )}
            </div>
          )}

          {/* Progress Section */}
          {(challenge.type === 'count' || challenge.type === 'time') && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-green-400">Progress</h3>
                <span className="text-white font-medium">
                  {challengeProgress}/{challenge.targetValue}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleProgressUpdate(Math.max(0, challengeProgress - 1))}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  disabled={challengeProgress <= 0}
                >
                  -1
                </button>
                <button
                  onClick={() => handleProgressUpdate(challengeProgress + 1)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  disabled={challenge.targetValue && challengeProgress >= challenge.targetValue}
                >
                  +1
                </button>
                <input
                  type="number"
                  value={challengeProgress}
                  onChange={(e) => handleProgressUpdate(parseInt(e.target.value) || 0)}
                  className="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20"
                  min="0"
                  max={challenge.targetValue}
                />
              </div>
            </div>
          )}

          {/* Checklist Section */}
          {challenge.type === 'checklist' && challenge.checklistItems && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-purple-400">Checklist</h3>
                <span className="text-white font-medium">
                  {challengeProgress}/{JSON.parse(challenge.checklistItems).length}
                </span>
              </div>
              <div className="space-y-2">
                {JSON.parse(challenge.checklistItems).map((item: string, index: number) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklistState[index] || false}
                      onChange={() => handleChecklistToggle(index)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className={`text-sm ${checklistState[index] ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {!challengeStarted && !challenge.completed && (
              <button
                onClick={handleStartChallenge}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Play size={20} />
                <span>Start Challenge</span>
              </button>
            )}

            {challengeStarted && !challenge.completed && (
              <button
                onClick={handleCompleteChallenge}
                disabled={!canComplete() || isCompleting}
                className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                  canComplete() && !isCompleting
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                <CheckCircle size={20} />
                <span>{isCompleting ? 'Completing...' : 'Complete Challenge'}</span>
              </button>
            )}

            {challenge.completed && (
              <div className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2">
                <Trophy size={20} />
                <span>Challenge Completed!</span>
              </div>
            )}
          </div>

          {challenge.completedAt && (
            <div className="text-center text-sm text-gray-400">
              Completed on {new Date(challenge.completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 