import { useState, useCallback, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { seasons, seasonGroups } from '../data/seasons.js'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function luminance({ r, g, b }) {
  return 0.299 * r + 0.587 * g + 0.114 * b
}

function textColor(hex) {
  return luminance(hexToRgb(hex)) > 160 ? '#2A2520' : '#F9F7F4'
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {})
}

export default function Home() {
  const [searchParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState(searchParams.get('season') || '')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [copiedHex, setCopiedHex] = useState(null)

  useEffect(() => {
    const paramSeason = searchParams.get('season')
    if (paramSeason) {
      setSelectedId(paramSeason)
      setPaletteIndex(0)
    }
  }, [searchParams])

  const season = seasons.find((s) => s.id === selectedId) || null
  const palette = season ? season.palettes[paletteIndex] : null
  const groupColor = season ? seasonGroups[season.group].color : null

  const handleSeasonChange = useCallback((e) => {
    setSelectedId(e.target.value)
    setPaletteIndex(0)
    setCopiedHex(null)
  }, [])

  const cyclePalette = useCallback(() => {
    if (!season) return
    setPaletteIndex((i) => (i + 1) % season.palettes.length)
    setCopiedHex(null)
  }, [season])

  const handleCopy = useCallback((hex) => {
    copyToClipboard(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 1600)
  }, [])

  const grouped = {}
  for (const s of seasons) {
    if (!grouped[s.group]) grouped[s.group] = []
    grouped[s.group].push(s)
  }

  return (
    <div className="page-home">
      <header className="site-header">
        <div className="header-inner">
          <span className="site-logo">Color Season</span>
          <nav className="site-nav">
            <Link to="/guide" className="nav-link">Season Guide</Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero">
          <p className="hero-eyebrow">Personal Colour Analysis</p>
          <h1 className="hero-title">Discover Your<br />Colour Season</h1>
          <div className="hero-rule" />
          <p className="hero-sub">
            Select your season to reveal a palette composed for you.
          </p>
        </section>

        <section className="selector-section">
          <div className="select-wrapper">
            <select
              className="season-select"
              value={selectedId}
              onChange={handleSeasonChange}
            >
              <option value="" disabled>Choose your colour season</option>
              {Object.entries(grouped).map(([group, list]) => (
                <optgroup key={group} label={seasonGroups[group].label}>
                  {list.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="select-caret" aria-hidden>&#8964;</span>
          </div>

          {season && (
            <p className="season-tagline">{season.tagline}</p>
          )}
        </section>

        {season && palette ? (
          <section className="palette-section">
            <div className="swatches">
              {palette.map((color) => (
                <div key={color.hex} className="swatch-col">
                  <button
                    className="swatch"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleCopy(color.hex)}
                    aria-label={`Copy ${color.name} — ${color.hex}`}
                  />
                  <div className="swatch-meta">
                    <span className="swatch-name">{color.name}</span>
                    <span
                      className={`swatch-hex${copiedHex === color.hex ? ' swatch-hex--copied' : ''}`}
                    >
                      {copiedHex === color.hex ? 'Copied' : color.hex.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="palette-footer">
              <span className="palette-counter">
                {paletteIndex + 1} / {season.palettes.length}
              </span>
              <button className="cycle-btn" onClick={cyclePalette}>
                Next Palette &nbsp;&#8594;
              </button>
              <Link
                to={`/guide#${season.id}`}
                className="guide-link"
              >
                About {season.name} &nbsp;&#8599;
              </Link>
            </div>
          </section>
        ) : (
          <section className="empty-state">
            <div className="empty-swatches">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="swatch-col">
                  <div className="swatch swatch--empty" />
                  <div className="swatch-meta swatch-meta--empty">
                    <span className="swatch-name-ph" />
                    <span className="swatch-hex-ph" />
                  </div>
                </div>
              ))}
            </div>
            <p className="empty-hint">
              Not sure which season you are?{' '}
              <Link to="/guide" className="inline-guide-link">Read the guide</Link>
            </p>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-rule" />
        <p>Color Season &nbsp;·&nbsp; Personal Colour Analysis</p>
      </footer>
    </div>
  )
}
