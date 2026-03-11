import { useState, useEffect, useRef } from 'react'

export default function SearchBar({ onSearch, loading, query }) {
  const [input, setInput] = useState(query || '')
  const inputRef = useRef(null)

  useEffect(() => {
    setInput(query || '')
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) onSearch(input.trim())
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for a word..."
          value={input}
          onChange={e => setInput(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        {input && (
          <button type="button" className="clear-btn" onClick={() => setInput('')} aria-label="Clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <button type="submit" className="search-btn" disabled={!input.trim() || loading}>
        {loading ? <span className="spinner" /> : 'Search'}
      </button>
    </form>
  )
}
