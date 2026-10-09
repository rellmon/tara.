import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="font-display text-5xl font-bold text-brand-600">tara.</h1>
      <p className="mt-2 text-muted">Your next adventure starts here.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="h-16 w-16 rounded-xl bg-brand-600" />
        <div className="h-16 w-16 rounded-xl bg-sage" />
        <div className="h-16 w-16 rounded-xl bg-sunset" />
        <div className="h-16 w-16 rounded-xl bg-charcoal" />
        <div className="h-16 w-16 rounded-xl border border-line bg-cream" />
      </div>
    </div>
  )
}

export default App