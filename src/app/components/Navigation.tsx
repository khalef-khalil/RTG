'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Target, BookOpen, Zap, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navLinks = [
    { href: '/challenges', icon: Target, label: 'Challenges' },
    { href: '/focus', icon: Zap, label: 'Focus' },
    { href: '/systems', icon: Settings, label: 'Systems' },
    { href: '/principles', icon: BookOpen, label: 'Principles' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Road to Greatness
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname === link.href 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/30 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      pathname === link.href 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-base">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 