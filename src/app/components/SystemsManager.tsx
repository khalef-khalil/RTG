'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Check, X, ArrowRight, Settings } from 'lucide-react'

interface SystemItem {
  id: string
  trigger: string
  action: string
  outcome: string
  category: string
  createdAt: Date
  source?: string
}

const categories = [
  'Morning', 'Evening', 'Work', 'Stress', 'Health', 'Social', 
  'Decision Making', 'Energy', 'Focus', 'Other'
]

export default function SystemsManager() {
  const [systems, setSystems] = useState<SystemItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSystems()
  }, [])

  const fetchSystems = async () => {
    try {
      const response = await fetch('/api/systems')
      if (response.ok) {
        const data = await response.json()
        const formattedSystems = data.map((system: { id: string; trigger: string; action: string; outcome: string; category: string; createdAt: string; source?: string }) => ({
          id: system.id,
          trigger: system.trigger,
          action: system.action,
          outcome: system.outcome,
          category: system.category,
          createdAt: new Date(system.createdAt),
          source: system.source
        }))
        setSystems(formattedSystems)
      }
    } catch (error) {
      console.error('Failed to fetch systems:', error)
    } finally {
      setLoading(false)
    }
  }

  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSystem, setNewSystem] = useState({
    trigger: '',
    action: '',
    outcome: '',
    category: 'Other',
    source: ''
  })

  const filteredSystems = systems.filter(system => {
    const categoryMatch = categoryFilter === 'all' || system.category === categoryFilter
    return categoryMatch
  })

  const handleAddSystem = async () => {
    if (newSystem.trigger.trim() && newSystem.action.trim() && newSystem.outcome.trim()) {
      try {
        const response = await fetch('/api/systems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            trigger: newSystem.trigger.trim(),
            action: newSystem.action.trim(),
            outcome: newSystem.outcome.trim(),
            category: newSystem.category,
            source: newSystem.source.trim() || null
          })
        })
        
        if (response.ok) {
          await fetchSystems()
          setNewSystem({ trigger: '', action: '', outcome: '', category: 'Other', source: '' })
          setIsAdding(false)
        }
      } catch (error) {
        console.error('Failed to add system:', error)
      }
    }
  }

  const handleEditSystem = async (id: string, updatedData: Partial<SystemItem>) => {
    try {
      const system = systems.find(s => s.id === id)
      if (!system) return

      const response = await fetch(`/api/systems/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trigger: updatedData.trigger || system.trigger,
          action: updatedData.action || system.action,
          outcome: updatedData.outcome || system.outcome,
          category: system.category,
          source: system.source
        })
      })
      
      if (response.ok) {
        await fetchSystems()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to edit system:', error)
    }
  }

  const handleDeleteSystem = async (id: string) => {
    try {
      const response = await fetch(`/api/systems/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchSystems()
      }
    } catch (error) {
      console.error('Failed to delete system:', error)
    }
  }

  const systemsByCategory = [...new Set(systems.map(s => s.category))]

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading systems...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Systems
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Automated behavioral shortcuts that eliminate decision-making. Program your default responses 
          to common situations and let your brain handle the rest.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{systems.length}</div>
            <div className="text-sm text-gray-400">Total Systems</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{systemsByCategory.length}</div>
            <div className="text-sm text-gray-400">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{Math.max(0, 20 - systems.length)}</div>
            <div className="text-sm text-gray-400">Remaining</div>
          </div>
        </div>
        
        {systems.length >= 20 && (
          <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-amber-300 text-sm">
              ⚡ You've reached the optimal number of systems. Consider refining existing ones rather than adding more.
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex justify-center">
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 pr-10 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg appearance-none cursor-pointer"
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

      {/* Add New System */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className={`w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed rounded-lg transition-colors ${
              systems.length >= 20 
                ? 'border-gray-600 text-gray-500 cursor-not-allowed' 
                : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
            }`}
            disabled={systems.length >= 20}
          >
            <Plus size={20} />
            <span>{systems.length >= 20 ? 'Maximum Systems Reached' : 'Add New System'}</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Create Your System</h3>
              <p className="text-gray-400 text-sm">Think: "When X happens, I do Y, which results in Z"</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    🎯 Trigger (When...)
                  </label>
                  <input
                    type="text"
                    value={newSystem.trigger}
                    onChange={(e) => setNewSystem({ ...newSystem, trigger: e.target.value })}
                    placeholder="When I wake up..."
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <ArrowRight className="text-amber-400 mt-6" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ⚡ Action (I do...)
                  </label>
                  <input
                    type="text"
                    value={newSystem.action}
                    onChange={(e) => setNewSystem({ ...newSystem, action: e.target.value })}
                    placeholder="I drink a glass of water..."
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <ArrowRight className="text-amber-400 mt-6" size={20} />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ✨ Outcome (Which results in...)
                  </label>
                  <input
                    type="text"
                    value={newSystem.outcome}
                    onChange={(e) => setNewSystem({ ...newSystem, outcome: e.target.value })}
                    placeholder="I feel energized and hydrated"
                    className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <select
                  value={newSystem.category}
                  onChange={(e) => setNewSystem({ ...newSystem, category: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-700 text-white">
                      {category}
                    </option>
                  ))}
                </select>

                <input
                  value={newSystem.source}
                  onChange={(e) => setNewSystem({ ...newSystem, source: e.target.value })}
                  placeholder="Source (optional)"
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleAddSystem}
                  className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  <Check size={16} />
                  <span>Create System</span>
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setNewSystem({ trigger: '', action: '', outcome: '', category: 'Other', source: '' })
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Systems List */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {filteredSystems.map(system => (
          <SystemCard
            key={system.id}
            system={system}
            isEditing={editingId === system.id}
            onEdit={(updatedData) => handleEditSystem(system.id, updatedData)}
            onDelete={() => handleDeleteSystem(system.id)}
            onStartEdit={() => setEditingId(system.id)}
            onCancelEdit={() => setEditingId(null)}
          />
        ))}
      </div>

      {filteredSystems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No systems found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

interface SystemCardProps {
  system: SystemItem
  isEditing: boolean
  onEdit: (updatedData: Partial<SystemItem>) => void
  onDelete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
}

function SystemCard({ 
  system, 
  isEditing, 
  onEdit, 
  onDelete, 
  onStartEdit, 
  onCancelEdit
}: SystemCardProps) {
  const [editData, setEditData] = useState({
    trigger: system.trigger,
    action: system.action,
    outcome: system.outcome
  })

  const handleSave = () => {
    if (editData.trigger.trim() && editData.action.trim() && editData.outcome.trim()) {
      onEdit(editData)
    }
  }

  return (
    <div className="p-4 rounded-lg border bg-amber-900/20 border-amber-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Settings size={16} className="text-amber-400 mt-1" />
          <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">
            {system.category}
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
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Trigger</label>
            <input
              value={editData.trigger}
              onChange={(e) => setEditData({ ...editData, trigger: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Action</label>
            <input
              value={editData.action}
              onChange={(e) => setEditData({ ...editData, action: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Outcome</label>
            <input
              value={editData.outcome}
              onChange={(e) => setEditData({ ...editData, outcome: e.target.value })}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm transition-colors"
            >
              <Check size={12} />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setEditData({ trigger: system.trigger, action: system.action, outcome: system.outcome })
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
          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-amber-400">WHEN</span>
              <p className="text-white text-sm">{system.trigger}</p>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="text-amber-400" size={16} />
              <span className="text-xs font-medium text-amber-400">I DO</span>
              <p className="text-white text-sm">{system.action}</p>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="text-amber-400" size={16} />
              <span className="text-xs font-medium text-amber-400">RESULT</span>
              <p className="text-white text-sm">{system.outcome}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Added {system.createdAt.toLocaleDateString()}</span>
            {system.source && (
              <span className="italic">Source: {system.source}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
} 