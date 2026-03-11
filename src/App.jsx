
import { useState, useEffect, useCallback } from 'react'
import SearchBar from './components/SearchBar'
import WordCard from './components/WordCard'

const SUGGESTED = ['ephemeral', 'serendipity', 'melancholy', 'eloquent', 'ubiquitous', 'resilience']

export default function App() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lexicon-history') || '[]') } catch { return [] }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('lexicon-theme') || 'dark')
  const [font, setFont] = useState(() => localStorage.getItem('lexicon-font') || 'inter')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('lexicon-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font)
    localStorage.setItem('lexicon-font', font)
  }, [font])

  const searchWord = useCallback(async (word) => {
    const trimmed = word.trim().toLowerCase()
    if (!trimmed) return
    setQuery(trimmed)
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(trimmed)}`
      )
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data[0])
      setHistory(prev => {
        const next = [trimmed, ...prev.filter(w => w !== trimmed)].slice(0, 8)
        localStorage.setItem('lexicon-history', JSON.stringify(next))
        return next
      })
    } catch {
      setError(`No definition found for "${trimmed}"`)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('lexicon-history')
  }

  const showEmpty = !loading && !result && !error

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <span className="brand-name">Lexicon</span>
          </div>
          <div className="header-controls">
            <select
              value={font}
              onChange={e => setFont(e.target.value)}
              className="font-select"
              aria-label="Select font"
            >
              <option value="inter">Sans Serif</option>
              <option value="lora">Serif</option>
              <option value="mono">Mono</option>
            </select>
            <div className="divider-v" />
            <button
              className="theme-toggle"
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <SearchBar onSearch={searchWord} loading={loading} query={query} />

          {showEmpty && (
            <>
              {history.length > 0 && (
                <div className="history-section">
                  <div className="section-header">
                    <span className="section-label">Recent Searches</span>
                    <button className="text-btn" onClick={clearHistory}>Clear all</button>
                  </div>
                  <div className="chips-row">
                    {history.map(word => (
                      <button key={word} className="history-chip" onClick={() => searchWord(word)}>
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="empty-state">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    <path d="M9 10h6M9 14h4" />
                  </svg>
                </div>
                <h2>Explore the Dictionary</h2>
                <p>Look up any English word for its definition, pronunciation, examples, and more.</p>
                <div className="suggestions">
                  <span className="section-label">Try one of these</span>
                  <div className="chips-row">
                    {SUGGESTED.map(word => (
                      <button key={word} className="history-chip" onClick={() => searchWord(word)}>
                        {word}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {loading && (
            <div className="loading-state">
              <div className="loader">
                <span /><span /><span />
              </div>
              <p>Looking up the word...</p>
            </div>
          )}

          {error && !loading && (
            <div className="error-state">
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3>Word Not Found</h3>
              <p>{error}</p>
              <p className="error-hint">Try checking your spelling or search for a different word.</p>
            </div>
          )}

          {result && !loading && (
            <WordCard data={result} onWordClick={searchWord} />
          )}
        </div>
      </main>
    </div>
  )
}

