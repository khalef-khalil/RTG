'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit3, Check, X, Zap } from 'lucide-react'

interface FocusItem {
  id: string
  text: string
  type: 'matters' | 'doesnt_matter'
  category: string
  createdAt: Date
  source?: string
}

const categories = [
  'Relationships', 'Career', 'Health', 'Personal Growth', 'Social', 
  'Appearance', 'Money', 'Time', 'Communication', 'Other'
]

export default function FocusManager() {
  const [focusItems, setFocusItems] = useState<FocusItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFocusItems()
  }, [])

  const fetchFocusItems = async () => {
    try {
      const response = await fetch('/api/focus')
      if (response.ok) {
        const data = await response.json()
        const formattedItems = data.map((item: { id: string; text: string; type: string; category: string; createdAt: string; source?: string }) => ({
          id: item.id,
          text: item.text,
          type: item.type as 'matters' | 'doesnt_matter',
          category: item.category,
          createdAt: new Date(item.createdAt),
          source: item.source
        }))
        setFocusItems(formattedItems)
      }
    } catch (error) {
      console.error('Failed to fetch focus items:', error)
    } finally {
      setLoading(false)
    }
  }

  const [filter, setFilter] = useState<'all' | 'matters' | 'doesnt_matter'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newFocusItem, setNewFocusItem] = useState({
    text: '',
    type: 'matters' as 'matters' | 'doesnt_matter',
    category: 'Other',
    source: ''
  })

  const filteredItems = focusItems.filter(item => {
    const typeMatch = filter === 'all' || item.type === filter
    const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter
    return typeMatch && categoryMatch
  })

  const handleAddFocusItem = async () => {
    if (newFocusItem.text.trim()) {
      try {
        const response = await fetch('/api/focus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newFocusItem.text.trim(),
            type: newFocusItem.type,
            category: newFocusItem.category,
            source: newFocusItem.source.trim() || null
          })
        })
        
        if (response.ok) {
          await fetchFocusItems()
          setNewFocusItem({ text: '', type: 'matters', category: 'Other', source: '' })
          setIsAdding(false)
        }
      } catch (error) {
        console.error('Failed to add focus item:', error)
      }
    }
  }

  const handleEditFocusItem = async (id: string, updatedText: string) => {
    try {
      const item = focusItems.find(f => f.id === id)
      if (!item) return

      const response = await fetch(`/api/focus/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: updatedText,
          type: item.type,
          category: item.category,
          source: item.source
        })
      })
      
      if (response.ok) {
        await fetchFocusItems()
        setEditingId(null)
      }
    } catch (error) {
      console.error('Failed to edit focus item:', error)
    }
  }

  const handleDeleteFocusItem = async (id: string) => {
    try {
      const response = await fetch(`/api/focus/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        await fetchFocusItems()
      }
    } catch (error) {
      console.error('Failed to delete focus item:', error)
    }
  }

  const mattersCount = focusItems.filter(f => f.type === 'matters').length
  const doesntMatterCount = focusItems.filter(f => f.type === 'doesnt_matter').length

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading focus items...</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Focus
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Clarity on what truly matters and what doesn't. Stop wasting mental energy on things 
          that won't matter in a year, and focus on what actually moves the needle.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{mattersCount}</div>
            <div className="text-sm text-gray-400">Matters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{doesntMatterCount}</div>
            <div className="text-sm text-gray-400">Doesn't Matter</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{focusItems.length}</div>
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
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('matters')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              filter === 'matters' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Zap size={16} />
            <span>Matters</span>
          </button>
          <button
            onClick={() => setFilter('doesnt_matter')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
              filter === 'doesnt_matter' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <X size={16} />
            <span>Doesn't Matter</span>
          </button>
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 pr-10 rounded-lg bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-lg appearance-none cursor-pointer"
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

      {/* Add New Focus Item */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center space-x-2 py-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors text-gray-300 hover:text-white"
          >
            <Plus size={20} />
            <span>Add Focus Item</span>
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setNewFocusItem({ ...newFocusItem, type: 'matters' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  newFocusItem.type === 'matters' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Zap size={16} />
                <span>Matters</span>
              </button>
              <button
                onClick={() => setNewFocusItem({ ...newFocusItem, type: 'doesnt_matter' })}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  newFocusItem.type === 'doesnt_matter' 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <X size={16} />
                <span>Doesn't Matter</span>
              </button>
            </div>

            <textarea
              value={newFocusItem.text}
              onChange={(e) => setNewFocusItem({ ...newFocusItem, text: e.target.value })}
              placeholder="What matters or doesn't matter..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={3}
            />

            <div className="flex space-x-4">
              <select
                value={newFocusItem.category}
                onChange={(e) => setNewFocusItem({ ...newFocusItem, category: e.target.value })}
                className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-700 text-white">
                    {category}
                  </option>
                ))}
              </select>

              <input
                value={newFocusItem.source}
                onChange={(e) => setNewFocusItem({ ...newFocusItem, source: e.target.value })}
                placeholder="Source (optional)"
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleAddFocusItem}
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
              >
                <Check size={16} />
                <span>Add Item</span>
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewFocusItem({ text: '', type: 'matters', category: 'Other', source: '' })
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

      {/* Focus Items List */}
      {filter === 'all' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Matters Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="text-blue-400" size={20} />
              <h3 className="text-xl font-semibold text-blue-400">What MATTERS</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-400/50 to-transparent"></div>
            </div>
            {filteredItems.filter(f => f.type === 'matters').map(item => (
              <FocusCard
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onEdit={(text) => handleEditFocusItem(item.id, text)}
                onDelete={() => handleDeleteFocusItem(item.id)}
                onStartEdit={() => setEditingId(item.id)}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </div>

          {/* Doesn't Matter Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <X className="text-gray-400" size={20} />
              <h3 className="text-xl font-semibold text-gray-400">What DOESN'T MATTER</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-400/50 to-transparent"></div>
            </div>
            {filteredItems.filter(f => f.type === 'doesnt_matter').map(item => (
              <FocusCard
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onEdit={(text) => handleEditFocusItem(item.id, text)}
                onDelete={() => handleDeleteFocusItem(item.id)}
                onStartEdit={() => setEditingId(item.id)}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map(item => (
            <FocusCard
              key={item.id}
              item={item}
              isEditing={editingId === item.id}
              onEdit={(text) => handleEditFocusItem(item.id, text)}
              onDelete={() => handleDeleteFocusItem(item.id)}
              onStartEdit={() => setEditingId(item.id)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No focus items found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

interface FocusCardProps {
  item: FocusItem
  isEditing: boolean
  onEdit: (text: string) => void
  onDelete: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
}

function FocusCard({ item, isEditing, onEdit, onDelete, onStartEdit, onCancelEdit }: FocusCardProps) {
  const [editText, setEditText] = useState(item.text)

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(editText.trim())
    }
  }

  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${
      item.type === 'matters' 
        ? 'bg-blue-900/20 border-blue-500/30' 
        : 'bg-gray-900/20 border-gray-500/30'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {item.type === 'matters' ? (
            <Zap size={16} className="text-blue-400 mt-1" />
          ) : (
            <X size={16} className="text-gray-400 mt-1" />
          )}
          <span className={`text-xs px-2 py-1 rounded-full ${
            item.type === 'matters' 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-gray-500/20 text-gray-300'
          }`}>
            {item.category}
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
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-sm transition-colors"
            >
              <Check size={12} />
              <span>Save</span>
            </button>
            <button
              onClick={() => {
                setEditText(item.text)
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
          <p className="text-white mb-3 leading-relaxed">{item.text}</p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Added {item.createdAt.toLocaleDateString()}</span>
            {item.source && (
              <span className="italic">Source: {item.source}</span>
            )}
          </div>
        </>
      )}
    </div>
  )
} 