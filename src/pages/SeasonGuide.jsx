import { useEffect, useRef } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { seasons, seasonGroups } from '../data/seasons.js'

const groupOrder = ['spring', 'summer', 'autumn', 'winter']

const groupIntros = {
  spring: {
    heading: 'Spring',
    description:
      'Spring types have warm golden undertones and a fresh, clear quality to their coloring. The four spring sub-seasons vary in lightness, depth, and how warm or vivid their ideal colors are — from the delicate pastels of Light Spring to the rich earth tones of Warm Spring.',
  },
  summer: {
    heading: 'Summer',
    description:
      'Summer types have cool blue-pink undertones and a soft, muted quality. The four summer sub-seasons range from barely-there pastels (Light Summer) to crisp icy clarity (Cool Summer), with Soft Summer being the most blended and muted of all 16 seasons.',
  },
  autumn: {
    heading: 'Autumn',
    description:
      'Autumn types have warm golden-orange undertones and an earthy, muted-to-rich quality. The four autumn sub-seasons span from softly muted (Soft Autumn) to intensely deep (Deep Autumn), with True Autumn being the classic harvest-toned season.',
  },
  winter: {
    heading: 'Winter',
    description:
      'Winter types have cool undertones and a high-contrast, clear quality. The four winter sub-seasons range from icy and frosty (Cool Winter) to vividly electric (Bright Winter), with True Winter being the archetypal black-and-white-contrast season.',
  },
}

export default function SeasonGuide() {
  const { seasonId } = useParams()
  const { hash } = useLocation()
  const seasonRefs = useRef({})

  useEffect(() => {
    const targetId = seasonId || hash.replace('#', '')
    if (targetId && seasonRefs.current[targetId]) {
      setTimeout(() => {
        seasonRefs.current[targetId].scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      window.scrollTo(0, 0)
    }
  }, [seasonId, hash])

  const grouped = {}
  for (const group of groupOrder) {
    grouped[group] = seasons.filter((s) => s.group === group)
  }

  return (
    <div className="page-guide">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="site-logo">Color Season</Link>
          <nav className="site-nav">
            <Link to="/guide" className="nav-link nav-link--active">Season Guide</Link>
          </nav>
        </div>
      </header>

      <main className="guide-main">
        <section className="guide-hero">
          <p className="hero-eyebrow">Reference</p>
          <h1 className="guide-title">The Colour<br />Season Guide</h1>
          <div className="hero-rule" />
          <p className="guide-intro">
            Personal colour analysis divides human colouring into 16 distinct seasons based on
            three qualities: <em>undertone</em> (warm vs. cool), <em>value</em>{' '}
            (light vs. dark), and <em>chroma</em> (clear vs. muted).
            Understanding your season helps you select colours that harmonise with your natural
            colouring — making your complexion glow and your eyes luminous.
          </p>
        </section>

        <section className="how-to-section">
          <h2 className="how-to-title">How to Find Your Season</h2>
          <div className="how-to-steps">
            {[
              {
                n: '01',
                head: 'Determine undertone',
                body: 'Hold pure white and warm ivory fabric near your bare face in natural light. If white is more flattering, you lean cool. If ivory is softer and kinder, you lean warm. If both look equally fine, you may be neutral.',
              },
              {
                n: '02',
                head: 'Assess value',
                body: 'Is your overall appearance light — fair skin, light hair, light eyes — or deep? Value narrows the field significantly before any other analysis.',
              },
              {
                n: '03',
                head: 'Check chroma',
                body: 'Do vivid, saturated colours look natural and harmonious on you, or do they overwhelm? Clear seasons welcome brightness; muted seasons need softness.',
              },
              {
                n: '04',
                head: 'Read the descriptions',
                body: 'Find which season description best matches your hair, eyes and skin, then test its signature palette against your face in natural light.',
              },
            ].map(({ n, head, body }) => (
              <div key={n} className="how-to-step">
                <span className="step-number">{n}</span>
                <div className="step-body">
                  <h3 className="step-head">{head}</h3>
                  <p className="step-text">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {groupOrder.map((group) => {
          const info = groupIntros[group]
          const groupSeasons = grouped[group]

          return (
            <section key={group} className={`group-section group-section--${group}`}>
              <div className="group-header">
                <p className="group-eyebrow">Colour Season</p>
                <h2 className="group-title">{info.heading}</h2>
                <p className="group-description">{info.description}</p>
              </div>

              <div className="season-cards">
                {groupSeasons.map((season) => (
                  <article
                    key={season.id}
                    id={season.id}
                    ref={(el) => { seasonRefs.current[season.id] = el }}
                    className="season-card"
                  >
                    <div className="season-card-left">
                      <div className="preview-swatches">
                        {season.palettes[0].map((color) => (
                          <div
                            key={color.hex}
                            className="preview-swatch"
                            style={{ backgroundColor: color.hex }}
                            title={`${color.name} · ${color.hex}`}
                          />
                        ))}
                      </div>
                      <Link
                        to={`/?season=${season.id}`}
                        className="try-season-link"
                      >
                        Explore palettes &#8594;
                      </Link>
                    </div>

                    <div className="season-card-right">
                      <div className="season-card-heading">
                        <h3 className="season-card-title">{season.name}</h3>
                        <p className="season-card-tagline">{season.tagline}</p>
                      </div>

                      <div className="season-traits">
                        {season.keyTraits.map((trait) => (
                          <span key={trait} className="trait-chip">{trait}</span>
                        ))}
                      </div>

                      <p className="season-description">{season.description}</p>

                      <div className="season-identification">
                        <p className="identification-label">How to recognise this season</p>
                        <p className="identification-text">{season.identification}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </main>

      <footer className="site-footer">
        <div className="footer-rule" />
        <p>Color Season &nbsp;·&nbsp; Personal Colour Analysis</p>
      </footer>
    </div>
  )
}
