import Navigation from './components/Navigation'
import SkillTree from './components/SkillTree'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16 h-screen">
        <SkillTree />
      </main>
    </div>
  )
}
