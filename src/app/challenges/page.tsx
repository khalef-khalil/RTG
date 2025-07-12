import Navigation from '../components/Navigation'
import ChallengesManager from '../components/ChallengesManager'

export default function ChallengesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <ChallengesManager />
      </main>
    </div>
  )
} 