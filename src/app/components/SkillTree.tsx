'use client'

import { useState, useEffect } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, Target, Play } from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: string
  targetValue?: number
  timeLimit?: number
  completed: boolean
  progress: number
}

interface Skill {
  id: string
  name: string
  baseSkill: string
  level: number
  description: string
  x: number
  y: number
  completed: boolean
  prerequisites: Skill[]
  category: 'foundation' | 'technical' | 'social' | 'creative' | 'leadership'
  challenge?: Challenge
}

const categoryColors = {
  foundation: 'from-blue-500 to-blue-600',
  technical: 'from-green-500 to-green-600',
  social: 'from-purple-500 to-purple-600',
  creative: 'from-orange-500 to-orange-600',
  leadership: 'from-red-500 to-red-600',
}

export default function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills')
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      } else {
        console.error('Failed to fetch skills')
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
  }

  const handleStartChallenge = (skillId: string) => {
    // This would open a challenge modal or navigate to challenge page
    console.log('Starting challenge for:', skillId)
  }

  const isSkillUnlocked = (skill: Skill) => {
    if (skill.prerequisites.length === 0) return true
    return skill.prerequisites.every(prereq => prereq.completed)
  }

  const renderConnections = () => {
    return skills.map(skill => 
      skill.prerequisites.map(prereq => {
        return (
          <line
            key={`${prereq.id}-${skill.id}`}
            x1={prereq.x}
            y1={prereq.y}
            x2={skill.x}
            y2={skill.y}
            stroke={isSkillUnlocked(skill) ? '#8b5cf6' : '#374151'}
            strokeWidth="2"
            strokeDasharray={isSkillUnlocked(skill) ? '0' : '5,5'}
            className="transition-all duration-300"
          />
        )
      })
    ).flat()
  }

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-white text-lg">Loading skill tree...</div>
      </div>
    )
  }

  return (
    <div className="h-full w-full relative">
      <TransformWrapper
        initialScale={0.6}
        minScale={0.2}
        maxScale={2}
        centerOnInit={true}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.15 }}
        panning={{ 
          velocityDisabled: false,
          lockAxisX: false,
          lockAxisY: false
        }}
        smooth={false}
        disablePadding={true}
        centerZoomedOut={false}
      >
        {({ zoomIn, zoomOut, setTransform }) => (
          <>
            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 skill-tree-controls">
              <button
                onClick={() => zoomIn()}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors"
              >
                <ZoomIn size={20} className="text-white" />
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg hover:bg-white/20 transition-colors"
              >
                <ZoomOut size={20} className="text-white" />
              </button>
              <button
                onClick={() => {
                  // Reset to center position where the skill tree nodes are visible
                  setTransform(0, 0, 0.6, 200)
                }}
                className="p-2 bg-purple-600/80 backdrop-blur-md rounded-lg hover:bg-purple-600 transition-colors"
                title="Center on skill tree"
              >
                <Target size={20} className="text-white" />
              </button>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 left-4 z-10 bg-black/20 backdrop-blur-md rounded-lg p-4 text-white max-w-sm skill-tree-instructions">
              <h3 className="font-semibold mb-2">How to Navigate</h3>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>• Drag to pan freely around the canvas</li>
                <li>• Scroll to zoom in/out</li>
                <li>• Click skills to view details</li>
                <li>• Use 🎯 button to return to skill tree</li>
                <li>• Complete prerequisites to unlock new skills</li>
              </ul>
            </div>

            <TransformComponent
              wrapperClass="w-full h-full"
              contentClass="w-full h-full flex items-center justify-center"
            >
              <div className="relative" style={{ width: '4000px', height: '4000px' }}>
                <svg
                  width="4000"
                  height="4000"
                  viewBox="-2000 -2000 4000 4000"
                  className="absolute inset-0"
                >
                  {/* Grid pattern */}
                  <defs>
                    <pattern
                      id="grid"
                      width="50"
                      height="50"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 50 0 L 0 0 0 50"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </pattern>
                  </defs>
                  <rect
                    x="-2000"
                    y="-2000"
                    width="4000"
                    height="4000"
                    fill="url(#grid)"
                  />
                  
                  {/* Skill connections */}
                  {renderConnections()}
                  
                  {/* Skills */}
                  {skills.map(skill => {
                    const unlocked = isSkillUnlocked(skill)
                    const displayName = skill.level > 1 ? `${skill.name}` : skill.name.replace(' I', '')
                    return (
                      <g key={skill.id}>
                        <circle
                          cx={skill.x}
                          cy={skill.y}
                          r="45"
                          fill={skill.completed ? '#10b981' : unlocked ? '#8b5cf6' : '#374151'}
                          stroke={selectedSkill?.id === skill.id ? '#fbbf24' : '#1f2937'}
                          strokeWidth="3"
                          className={`cursor-pointer transition-all duration-300 ${
                            unlocked ? 'hover:fill-purple-400' : ''
                          }`}
                          onClick={() => unlocked && handleSkillClick(skill)}
                        />
                        <text
                          x={skill.x}
                          y={skill.y - 5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="9"
                          fontWeight="bold"
                          className="pointer-events-none select-none"
                        >
                          {displayName.split(' ').map((word, i) => (
                            <tspan key={i} x={skill.x} dy={i === 0 ? 0 : '10'}>
                              {word}
                            </tspan>
                          ))}
                        </text>
                        {skill.level > 1 && (
                          <text
                            x={skill.x}
                            y={skill.y + 15}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="8"
                            className="pointer-events-none select-none"
                          >
                            {['', 'I', 'II', 'III', 'IV', 'V'][skill.level]}
                          </text>
                        )}
                      </g>
                    )
                  })}
                </svg>
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Skill Details Panel */}
      {selectedSkill && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-6 text-white max-w-2xl mx-auto fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">
              {selectedSkill.name}
              {selectedSkill.level > 1 && (
                <span className="ml-2 text-sm text-gray-400">
                  Level {['', 'I', 'II', 'III', 'IV', 'V'][selectedSkill.level]}
                </span>
              )}
            </h3>
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-300 mb-4">{selectedSkill.description}</p>
          
          {selectedSkill.challenge && (
            <div className="mb-4 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="font-semibold mb-2 text-yellow-400">Challenge:</h4>
              <p className="text-sm font-medium mb-2">{selectedSkill.challenge.title}</p>
              <p className="text-xs text-gray-400 mb-2">{selectedSkill.challenge.description}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Type: {selectedSkill.challenge.type}</span>
                {selectedSkill.challenge.timeLimit && (
                  <span>Time: {selectedSkill.challenge.timeLimit}h</span>
                )}
                {selectedSkill.challenge.targetValue && (
                  <span>Target: {selectedSkill.challenge.targetValue}</span>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${categoryColors[selectedSkill.category]}`} />
              <span className="text-sm text-gray-400 capitalize">{selectedSkill.category}</span>
            </div>
            
            {!selectedSkill.completed && isSkillUnlocked(selectedSkill) && (
              <button
                onClick={() => handleStartChallenge(selectedSkill.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                <Play size={16} />
                <span>Start Challenge</span>
              </button>
            )}
            
            {selectedSkill.completed && (
              <div className="flex items-center space-x-2 text-green-400">
                <span>✓ Completed</span>
              </div>
            )}
            
            {!isSkillUnlocked(selectedSkill) && (
              <div className="text-gray-500 text-sm">
                Complete prerequisites first
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 