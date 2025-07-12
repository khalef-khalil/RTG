import Navigation from './components/Navigation'
import ChallengeTracker from './components/ChallengeTracker'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16 h-screen">
        <ChallengeTracker />
      </main>
    </div>
  )
}
