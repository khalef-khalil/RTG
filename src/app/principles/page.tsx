import Navigation from '../components/Navigation'
import PrinciplesManager from '../components/PrinciplesManager'

export default function PrinciplesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <PrinciplesManager />
      </main>
    </div>
  )
} 