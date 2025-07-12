'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Target, BookOpen } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent navigation-title">
              Road to Greatness
            </div>
          </div>
          
          <div className="flex space-x-1 navigation-links">
            <Link
              href="/challenges"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 navigation-link ${
                pathname === '/challenges' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Target size={20} />
              <span>Challenges</span>
            </Link>
            
            <Link
              href="/principles"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 navigation-link ${
                pathname === '/principles' 
                  ? 'bg-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <BookOpen size={20} />
              <span>Principles</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 