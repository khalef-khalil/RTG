import Navigation from '../components/Navigation'
import SystemsManager from '../components/SystemsManager'

export default function SystemsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <SystemsManager />
      </main>
    </div>
  )
} 