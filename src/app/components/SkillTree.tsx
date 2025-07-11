'use client'

import { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { ZoomIn, ZoomOut, RotateCcw, Play, Target } from 'lucide-react'

interface Skill {
  id: string
  name: string
  description: string
  x: number
  y: number
  completed: boolean
  locked: boolean
  prerequisites: string[]
  category: 'foundation' | 'technical' | 'social' | 'creative' | 'leadership'
}

const initialSkills: Skill[] = [
  // Foundation Skills (Center)
  { id: 'self-awareness', name: 'Self-Awareness', description: 'Understanding your strengths, weaknesses, and motivations', x: 0, y: 0, completed: false, locked: false, prerequisites: [], category: 'foundation' },
  { id: 'goal-setting', name: 'Goal Setting', description: 'Learn to set SMART goals and create actionable plans', x: 0, y: -150, completed: false, locked: true, prerequisites: ['self-awareness'], category: 'foundation' },
  { id: 'time-management', name: 'Time Management', description: 'Master your schedule and prioritize effectively', x: 150, y: -75, completed: false, locked: true, prerequisites: ['self-awareness'], category: 'foundation' },
  { id: 'critical-thinking', name: 'Critical Thinking', description: 'Analyze information objectively and make better decisions', x: -150, y: -75, completed: false, locked: true, prerequisites: ['self-awareness'], category: 'foundation' },
  
  // Technical Skills (Right side)
  { id: 'basic-coding', name: 'Basic Coding', description: 'Learn fundamental programming concepts', x: 300, y: 0, completed: false, locked: true, prerequisites: ['critical-thinking'], category: 'technical' },
  { id: 'data-analysis', name: 'Data Analysis', description: 'Understand and interpret data to make informed decisions', x: 300, y: -150, completed: false, locked: true, prerequisites: ['basic-coding'], category: 'technical' },
  { id: 'digital-literacy', name: 'Digital Literacy', description: 'Master essential digital tools and platforms', x: 450, y: -75, completed: false, locked: true, prerequisites: ['time-management'], category: 'technical' },
  
  // Social Skills (Left side)
  { id: 'communication', name: 'Communication', description: 'Express ideas clearly and listen actively', x: -300, y: 0, completed: false, locked: true, prerequisites: ['critical-thinking'], category: 'social' },
  { id: 'empathy', name: 'Empathy', description: 'Understand and share the feelings of others', x: -300, y: -150, completed: false, locked: true, prerequisites: ['communication'], category: 'social' },
  { id: 'networking', name: 'Networking', description: 'Build meaningful professional relationships', x: -450, y: -75, completed: false, locked: true, prerequisites: ['communication'], category: 'social' },
  
  // Creative Skills (Top)
  { id: 'creative-thinking', name: 'Creative Thinking', description: 'Generate innovative solutions and ideas', x: 0, y: -300, completed: false, locked: true, prerequisites: ['goal-setting'], category: 'creative' },
  { id: 'problem-solving', name: 'Problem Solving', description: 'Approach challenges systematically and find solutions', x: 150, y: -225, completed: false, locked: true, prerequisites: ['creative-thinking', 'data-analysis'], category: 'creative' },
  
  // Leadership Skills (Bottom)
  { id: 'self-discipline', name: 'Self-Discipline', description: 'Develop willpower and consistent habits', x: 0, y: 150, completed: false, locked: true, prerequisites: ['self-awareness'], category: 'leadership' },
  { id: 'leadership', name: 'Leadership', description: 'Guide and inspire others toward common goals', x: 0, y: 300, completed: false, locked: true, prerequisites: ['self-discipline', 'empathy'], category: 'leadership' },
]

const categoryColors = {
  foundation: 'from-blue-500 to-blue-600',
  technical: 'from-green-500 to-green-600',
  social: 'from-purple-500 to-purple-600',
  creative: 'from-orange-500 to-orange-600',
  leadership: 'from-red-500 to-red-600',
}

export default function SkillTree() {
  const [skills, setSkills] = useState<Skill[]>(initialSkills)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill)
  }

  const handleStartChallenge = (skillId: string) => {
    // This would open a challenge modal or navigate to challenge page
    console.log('Starting challenge for:', skillId)
  }

  const isSkillUnlocked = (skill: Skill) => {
    if (skill.prerequisites.length === 0) return true
    return skill.prerequisites.every(prereqId => 
      skills.find(s => s.id === prereqId)?.completed
    )
  }

  const renderConnections = () => {
    return skills.map(skill => 
      skill.prerequisites.map(prereqId => {
        const prereq = skills.find(s => s.id === prereqId)
        if (!prereq) return null
        
        return (
          <line
            key={`${prereqId}-${skill.id}`}
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

  return (
    <div className="h-full w-full relative">
      <TransformWrapper
        initialScale={0.8}
        minScale={0.3}
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
                  setTransform(0, 0, 0.8, 200)
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
              <div className="relative" style={{ width: '2000px', height: '2000px' }}>
                <svg
                  width="2000"
                  height="2000"
                  viewBox="-1000 -1000 2000 2000"
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
                    x="-1000"
                    y="-1000"
                    width="2000"
                    height="2000"
                    fill="url(#grid)"
                  />
                  
                  {/* Skill connections */}
                  {renderConnections()}
                  
                  {/* Skills */}
                  {skills.map(skill => {
                    const unlocked = isSkillUnlocked(skill)
                    return (
                      <g key={skill.id}>
                        <circle
                          cx={skill.x}
                          cy={skill.y}
                          r="40"
                          fill={skill.completed ? '#10b981' : unlocked ? '#8b5cf6' : '#374151'}
                          stroke={selectedSkill?.id === skill.id ? '#fbbf24' : '#1f2937'}
                          strokeWidth="3"
                          className={`cursor-pointer transition-all duration-300 ${
                            unlocked ? 'hover:scale-110' : ''
                          }`}
                          onClick={() => unlocked && handleSkillClick(skill)}
                        />
                        <text
                          x={skill.x}
                          y={skill.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                          className="pointer-events-none select-none"
                        >
                          {skill.name.split(' ').map((word, i) => (
                            <tspan key={i} x={skill.x} dy={i === 0 ? 0 : '12'}>
                              {word}
                            </tspan>
                          ))}
                        </text>
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
        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-6 text-white max-w-md mx-auto fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{selectedSkill.name}</h3>
            <button
              onClick={() => setSelectedSkill(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <p className="text-gray-300 mb-4">{selectedSkill.description}</p>
          
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