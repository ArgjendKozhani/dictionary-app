import { useState } from 'react'

export default function WordCard({ data, onWordClick }) {
  const [playingAudio, setPlayingAudio] = useState(false)

  const audioUrl = data.phonetics?.find(p => p.audio)?.audio

  const playAudio = () => {
    if (!audioUrl) return
    const audio = new Audio(audioUrl)
    setPlayingAudio(true)
    audio.play().catch(() => setPlayingAudio(false))
    audio.onended = () => setPlayingAudio(false)
  }

  return (
    <div className="word-card">
      <div className="word-header">
        <div>
          <h1 className="word-title">{data.word}</h1>
          {data.phonetic && <span className="phonetic">{data.phonetic}</span>}
        </div>
        {audioUrl && (
          <button
            className={`audio-btn${playingAudio ? ' playing' : ''}`}
            onClick={playAudio}
            aria-label="Play pronunciation"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          </button>
        )}
      </div>

      {data.meanings?.map((meaning, i) => (
        <div className="meaning-section" key={i}>
          <div className="pos-header">
            <span className="pos-badge">{meaning.partOfSpeech}</span>
            <div className="divider" />
          </div>
          <p className="meaning-label">Meaning</p>
          <ul className="definitions-list">
            {meaning.definitions.slice(0, 3).map((def, j) => (
              <li key={j} className="definition-item">
                <p className="definition-text">{def.definition}</p>
                {def.example && (
                  <p className="example-text">"{def.example}"</p>
                )}
              </li>
            ))}
          </ul>
          {meaning.synonyms?.length > 0 && (
            <div className="word-relations">
              <span className="relation-label">Synonyms</span>
              <div className="chips">
                {meaning.synonyms.slice(0, 8).map((syn, k) => (
                  <button key={k} className="chip" onClick={() => onWordClick(syn)}>
                    {syn}
                  </button>
                ))}
              </div>
            </div>
          )}
          {meaning.antonyms?.length > 0 && (
            <div className="word-relations">
              <span className="relation-label">Antonyms</span>
              <div className="chips">
                {meaning.antonyms.slice(0, 8).map((ant, k) => (
                  <button key={k} className="chip chip-antonym" onClick={() => onWordClick(ant)}>
                    {ant}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {data.sourceUrls?.[0] && (
        <div className="source-section">
          <span className="source-label">Source</span>
          <a
            href={data.sourceUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            {data.sourceUrls[0]}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
