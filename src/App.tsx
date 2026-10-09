import Button from './components/ui/Button'

function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="font-display text-5xl font-bold text-brand-600">tara.</h1>
      <p className="mt-2 text-muted">Your next adventure starts here.</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button onClick={() => alert('Tara!')}>Create a trip</Button>
        <Button variant="secondary">View itineraries</Button>
        <Button variant="ghost">Learn more</Button>
        <Button size="lg">Get started</Button>
        <Button disabled>Disabled</Button>
      </div>
    </div>
  )
}

export default App