'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Check, X, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react'

interface Principle {
  id: string
  text: string
  type: 'do' | 'dont'
  category: string
  dateAdded: Date
  source?: string
  quote?: string
  description?: string
}

const initialPrinciples: Principle[] = [
  {
    id: '1',
    text: 'Start each day by identifying your top 3 priorities',
    type: 'do',
    category: 'Productivity',
    dateAdded: new Date('2024-01-01'),
    source: 'Personal experience',
    quote: 'The key is not to prioritize what\'s on your schedule, but to schedule your priorities.',
    description: 'Begin each morning by writing down the three most important tasks that will move you toward your goals. This creates clarity and prevents getting overwhelmed by less important activities.'
  },
  {
    id: '2',
    text: 'Listen more than you speak in conversations',
    type: 'do',
    category: 'Communication',
    dateAdded: new Date('2024-01-02'),
    source: 'Dale Carnegie',
    quote: 'Most people do not listen with the intent to understand; they listen with the intent to reply.',
    description: 'Practice active listening by focusing on understanding the other person\'s perspective rather than formulating your response. This builds stronger relationships and helps you learn from others.'
  },
  {
    id: '3',
    text: 'Never make important decisions when you&apos;re emotional',
    type: 'dont',
    category: 'Decision Making',
    dateAdded: new Date('2024-01-03'),
    source: 'Life lesson',
    quote: 'When emotions run high, logic runs low.',
    description: 'Emotions can cloud judgment and lead to poor decisions. Always wait until you\'re in a calm, rational state before making significant choices about relationships, career, or finances.'
  },
  {
    id: '4',
    text: 'Compare yourself to others on social media',
    type: 'dont',
    category: 'Mental Health',
    dateAdded: new Date('2024-01-04'),
    source: 'Psychology research',
    description: 'Social media shows curated highlights, not reality. Comparing your behind-the-scenes to others\' highlight reels leads to unnecessary stress and unrealistic expectations.'
  },
  {
    id: '5',
    text: 'Invest in yourself through continuous learning',
    type: 'do',
    category: 'Growth',
    dateAdded: new Date('2024-01-05'),
    source: 'Warren Buffett',
    quote: 'The best investment you can make is in yourself.',
    description: 'Dedicate time and resources to developing your skills, knowledge, and personal growth. This compound interest on yourself pays the highest returns over time.'
  },
]

const categories = [
  'Productivity', 'Communication', 'Decision Making', 'Mental Health', 
  'Growth', 'Relationships', 'Finance', 'Health', 'Career', 'Other'
]

export default function PrinciplesManager() {
  const [principles, setPrinciples] = useState<Principle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrinciples()
  }, [])

  const fetchPrinciples = async () => {
    try {
      const response = await fetch('/api/principles')
      const data = await response.json()
      
      if (response.ok && Array.isArray(data)) {
        // Convert API data to match our interface
        const formattedPrinciples = data.map((p: { id: string; text: string; type: string; category: string; createdAt: string; source?: string; quote?: string; description?: string }) => ({
          id: p.id,
          text: p.text,
          type: p.type as 'do' | 'dont',
          category: p.category,
          dateAdded: new Date(p.createdAt),
          source: p.source,
          quote: p.quote,
          description: p.description
        }))
        setPrinciples(formattedPrinciples)
      } else {
        console.error('Error fetching principles:', data.error || 'Invalid response format')
        setPrinciples(initialPrinciples)
      }
    } catch (error) {
      console.error('Failed to fetch principles:', error)
      setPrinciples(initialPrinciples)
    } finally {
      setLoading(false)
    }
  }
  const [filter, setFilter] = useState<'all' | 'do' | 'dont'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newPrinciple, setNewPrinciple] = useState({
    text: '',
    type: 'do' as 'do' | 'dont',
    category: 'Other',
    source: '',
    quote: '',
    description: ''
  })

  const filteredPrinciples = principles.filter(principle => {
    const typeMatch = filter === 'all' || principle.type === filter
    const categoryMatch = categoryFilter === 'all' || principle.category === categoryFilter
    return typeMatch && categoryMatch
  })

  const handleAddPrinciple = async () => {
    if (newPrinciple.text.trim()) {
      try {
        const response = await fetch('/api/principles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newPrinciple.text.trim(),
            type: newPrinciple.type,
            category: newPrinciple.category,
            source: newPrinciple.source.trim() || null,
            quote: newPrinciple.quote.trim() || null,
            description: newPrinciple.description.trim() || null
          })
        })
        
        if (response.ok) {
          await fetchPrinciples() // Refresh the list
          setNewPrinciple({ text: '', type: 'do', category: 'Other', source: '', quote: '', description: '' })
          setIsAdding(false)
        }
      } catch (error) {
        console.error('Failed to add principle:', error)
      }
    }
  }

  const handleEditPrinciple = async (id: string, updatedData: Partial<Principle>) => {
    try {
      const principle = principles.find(p => p.id === id)
      if (!principle) return

      const response = await fetch(`/api/principles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: updatedData.text || principle.text,
          type: updatedData.type || principle.type,
          category: updatedData.category || principle.category,
          source: updatedData.source || principle.source,
          quote: updatedData.quote || principle.quote,
          description: updatedData.description || principle.description
        })
      })
      
      if (response.ok) {
        await fetchPrinciples() // Refresh the list
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to edit principle:', error)
    }
  }

  const handleDeletePrinciple = async (id: string) => {
    try {
      const response = await fetch(`/api/principles/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchPrinciples() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete principle:', error)
    }
  }

  const doCount = principles.filter(p => p.type === 'do').length
  const dontCount = principles.filter(p => p.type === 'dont').length

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-3">
          <Loader2 size={24} className="animate-spin text-emerald-400" />
          <span className="text-white text-lg">Loading principles...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
          Life Principles
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Your personal collection of dos and don'ts - wisdom gained through experience, 
          learning, and understanding how the world truly works.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{doCount}</div>
            <div className="text-sm text-gray-400">Dos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{dontCount}</div>
            <div className="text-sm text-gray-400">Don'ts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{principles.length}</div>
            <div className="text-sm text-gray-400">Total</div>
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
                ? 'bg-emerald-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('do')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              filter === 'do' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ThumbsUp size={16} />
            <span>Dos</span>
          </button>
          <button
            onClick={() => setFilter('dont')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              filter === 'dont' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ThumbsDown size={16} />
            <span>Don'ts</span>
          </button>
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 pr-10 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-lg appearance-none cursor-pointer"
          >
            <option value="all">🌟 All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-800 text-white">
                📂 {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Add New Principle */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-gray-300 hover:text-white"
          >
            <Plus size={20} />
            <span>Add New Principle</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setNewPrinciple({ ...newPrinciple, type: 'do' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  newPrinciple.type === 'do' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ThumbsUp size={16} />
                <span>Do</span>
              </button>
              <button
                onClick={() => setNewPrinciple({ ...newPrinciple, type: 'dont' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  newPrinciple.type === 'dont' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ThumbsDown size={16} />
                <span>Don't</span>
              </button>
            </div>

            <textarea
              value={newPrinciple.text}
              onChange={(e) => setNewPrinciple({ ...newPrinciple, text: e.target.value })}
              placeholder="Write your principle here..."
                              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
            />

            <div className="flex space-x-4">
              <select
                value={newPrinciple.category}
                onChange={(e) => setNewPrinciple({ ...newPrinciple, category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-700 text-white">
                    {category}
                  </option>
                ))}
              </select>

              <input
                value={newPrinciple.source}
                onChange={(e) => setNewPrinciple({ ...newPrinciple, source: e.target.value })}
                placeholder="Source (optional)"
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <textarea
              value={newPrinciple.quote}
              onChange={(e) => setNewPrinciple({ ...newPrinciple, quote: e.target.value })}
              placeholder="Quote (optional) - Add a relevant quote that supports this principle..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={2}
            />

            <textarea
              value={newPrinciple.description}
              onChange={(e) => setNewPrinciple({ ...newPrinciple, description: e.target.value })}
              placeholder="Description (optional) - Explain why this principle matters and how to apply it..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3}
            />

            <div className="flex space-x-2">
              <button
                onClick={handleAddPrinciple}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                <Check size={16} />
                <span>Add Principle</span>
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewPrinciple({ text: '', type: 'do', category: 'Other', source: '', quote: '', description: '' })
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

      {/* Principles List */}
      {filter === 'all' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Dos Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ThumbsUp className="text-green-400" size={20} />
              <h3 className="text-xl font-semibold text-green-400">Things to DO</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-green-400/50 to-transparent"></div>
            </div>
            {filteredPrinciples.filter(p => p.type === 'do').map(principle => (
              <PrincipleCard
                key={principle.id}
                principle={principle}
                isEditing={editingId === principle.id}
                onEdit={(updatedData) => handleEditPrinciple(principle.id, updatedData)}
                onDelete={() => handleDeletePrinciple(principle.id)}
                onStartEdit={() => setEditingId(principle.id)}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </div>

          {/* Don'ts Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <ThumbsDown className="text-red-400" size={20} />
              <h3 className="text-xl font-semibold text-red-400">Things to AVOID</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-red-400/50 to-transparent"></div>
            </div>
            {filteredPrinciples.filter(p => p.type === 'dont').map(principle => (
              <PrincipleCard
                key={principle.id}
                principle={principle}
                isEditing={editingId === principle.id}
                onEdit={(updatedData) => handleEditPrinciple(principle.id, updatedData)}
                onDelete={() => handleDeletePrinciple(principle.id)}
                onStartEdit={() => setEditingId(principle.id)}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 principles-grid">
          {filteredPrinciples.map(principle => (
            <PrincipleCard
              key={principle.id}
              principle={principle}
              isEditing={editingId === principle.id}
              onEdit={(updatedData) => handleEditPrinciple(principle.id, updatedData)}
              onDelete={() => handleDeletePrinciple(principle.id)}
              onStartEdit={() => setEditingId(principle.id)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))}
        </div>
      )}

      {filteredPrinciples.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No principles found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

interface PrincipleCardProps {
  principle: Principle
  isEditing: boolean
  onEdit: (updatedData: Partial<Principle>) => void
  onDelete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
}

function PrincipleCard({ principle, isEditing, onEdit, onDelete, onStartEdit, onCancelEdit }: PrincipleCardProps) {
  const [editData, setEditData] = useState({
    text: principle.text,
    type: principle.type,
    category: principle.category,
    source: principle.source || '',
    quote: principle.quote || '',
    description: principle.description || ''
  })

  const handleSave = () => {
    if (editData.text.trim()) {
      onEdit(editData)
    }
  }

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 principle-card ${
      principle.type === 'do' 
        ? 'bg-green-900/20 border-green-500/30' 
        : 'bg-red-900/20 border-red-500/30'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {principle.type === 'do' ? (
            <ThumbsUp size={16} className="text-green-400 mt-1" />
          ) : (
            <ThumbsDown size={16} className="text-red-400 mt-1" />
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${
            principle.type === 'do' 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {principle.category}
          </span>
        </div>
        
        <div className="flex space-x-1">
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
          <div className="flex space-x-4">
            <button
              onClick={() => setEditData({ ...editData, type: 'do' })}
              className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                editData.type === 'do' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ThumbsUp size={14} />
              <span>Do</span>
            </button>
            <button
              onClick={() => setEditData({ ...editData, type: 'dont' })}
              className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                editData.type === 'dont' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <ThumbsDown size={14} />
              <span>Don't</span>
            </button>
          </div>

          <textarea
            value={editData.text}
            onChange={(e) => setEditData({ ...editData, text: e.target.value })}
            placeholder="Write your principle here..."
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            rows={3}
          />

          <div className="flex space-x-4">
            <select
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-700 text-white">
                  {category}
                </option>
              ))}
            </select>

            <input
              value={editData.source}
              onChange={(e) => setEditData({ ...editData, source: e.target.value })}
              placeholder="Source (optional)"
              className="flex-1 px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <textarea
            value={editData.quote}
            onChange={(e) => setEditData({ ...editData, quote: e.target.value })}
            placeholder="Quote (optional) - Add a relevant quote that supports this principle..."
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
            rows={2}
          />

          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            placeholder="Description (optional) - Explain why this principle matters and how to apply it..."
            className="w-full p-2 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none text-sm"
            rows={3}
          />

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm transition-colors"
            >
              <Check size={12} />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setEditData({
                  text: principle.text,
                  type: principle.type,
                  category: principle.category,
                  source: principle.source || '',
                  quote: principle.quote || '',
                  description: principle.description || ''
                })
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
          <p className="text-white mb-3 leading-relaxed">{principle.text}</p>
          {principle.quote && (
            <blockquote className="border-l-4 border-emerald-500/50 pl-4 mb-3">
              <p className="text-emerald-300 italic text-sm leading-relaxed">"{principle.quote}"</p>
            </blockquote>
          )}
          {principle.description && (
            <div className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-gray-300 text-sm leading-relaxed">{principle.description}</p>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Added {principle.dateAdded.toLocaleDateString()}</span>
            {principle.source && (
              <span className="italic">Source: {principle.source}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
} 