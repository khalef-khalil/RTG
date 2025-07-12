import Navigation from '../components/Navigation'
import FocusManager from '../components/FocusManager'

export default function FocusPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <FocusManager />
      </main>
    </div>
  )
} 