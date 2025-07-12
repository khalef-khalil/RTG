import Navigation from './components/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16 flex items-center justify-center min-h-screen">
        <div className="text-center space-y-6 max-w-4xl mx-auto p-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Road to Greatness
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your journey to personal excellence starts here. Track your challenges, 
            learn from principles, and build the life you've always wanted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <a
              href="/challenges"
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Start Your Challenges</span>
            </a>
            <a
              href="/focus"
              className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Clarify Your Focus</span>
            </a>
            <a
              href="/principles"
              className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-lg"
            >
              <span>Explore Principles</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
