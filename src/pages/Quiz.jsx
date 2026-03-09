import { useState } from 'react'
import { Link } from 'react-router-dom'
import { seasons } from '../data/seasons.js'

// ─── Season profiles on 4 dimensions ──────────────────────────────────────────
// ut:       -2 = very cool … +2 = very warm
// depth:     1 = light … 3 = deep
// clarity:  -2 = very muted … +3 = very bright / vivid
// contrast:  1 = low … 3 = high
const PROFILES = {
  'light-spring':  { ut:  2,  depth: 1,   clarity:  2,  contrast: 1   },
  'true-spring':   { ut:  2,  depth: 1.5, clarity:  2,  contrast: 2   },
  'bright-spring': { ut:  1,  depth: 2,   clarity:  3,  contrast: 3   },
  'warm-spring':   { ut:  2,  depth: 2,   clarity:  1,  contrast: 1.5 },
  'light-summer':  { ut: -2,  depth: 1,   clarity: -1,  contrast: 1   },
  'true-summer':   { ut: -2,  depth: 1.5, clarity: -2,  contrast: 1.5 },
  'soft-summer':   { ut: -1,  depth: 2,   clarity: -2,  contrast: 1   },
  'cool-summer':   { ut: -2,  depth: 2,   clarity: -1,  contrast: 2   },
  'soft-autumn':   { ut:  1,  depth: 2,   clarity: -2,  contrast: 1   },
  'true-autumn':   { ut:  2,  depth: 2,   clarity: -2,  contrast: 2   },
  'deep-autumn':   { ut:  2,  depth: 3,   clarity: -1,  contrast: 2.5 },
  'dark-autumn':   { ut:  2,  depth: 2.5, clarity: -2,  contrast: 2   },
  'true-winter':   { ut: -2,  depth: 2,   clarity:  2,  contrast: 3   },
  'bright-winter': { ut:  0,  depth: 2,   clarity:  3,  contrast: 3   },
  'dark-winter':   { ut: -1,  depth: 3,   clarity:  1,  contrast: 3   },
  'cool-winter':   { ut: -2,  depth: 2,   clarity:  2,  contrast: 2.5 },
}

const QUESTIONS = [
  {
    id: 'veins',
    question: 'Look at the veins on your inner wrist in natural light. What color do they appear?',
    options: [
      { label: 'Blue or purple',      sub: 'Distinctly cool-toned',    ut: -2 },
      { label: 'Blue-green or teal',  sub: 'A blend of warm and cool',  ut:  0 },
      { label: 'Green or olive',      sub: 'Noticeably warm-toned',     ut:  2 },
      { label: 'Hard to tell',        sub: "I really can't decide",     ut:  0 },
    ],
  },
  {
    id: 'jewelry',
    question: 'Which metal jewellery tends to make your skin glow?',
    options: [
      { label: 'Silver or platinum',  sub: 'Cool metals brighten me',   ut: -2 },
      { label: 'Yellow gold',         sub: 'Warm metals suit me best',  ut:  2 },
      { label: 'Rose gold',           sub: 'Warm but soft and rosy',    ut:  1 },
      { label: 'Both equally',        sub: 'I look good in most metals', ut:  0 },
    ],
  },
  {
    id: 'drape',
    question: 'Hold crisp white and warm ivory fabrics near your bare face. Which looks more flattering?',
    options: [
      { label: 'Crisp white',         sub: 'It brightens and lifts my face',       ut: -2 },
      { label: 'Warm ivory or cream', sub: 'It gives me a healthy, radiant glow',  ut:  2 },
      { label: 'Both look fine',      sub: 'I see little difference',              ut:  0 },
      { label: 'Neither feels right', sub: 'Both make me look a little washed out', ut: 0 },
    ],
  },
  {
    id: 'depth',
    question: 'How would you describe the overall depth of your natural coloring?',
    sub: 'Think about your skin, hair, and eyes together.',
    options: [
      { label: 'Very light',     sub: 'Fair skin, light or golden hair, light eyes',         depth: 1   },
      { label: 'Light to medium', sub: 'Light to medium skin, medium or warm-brown hair',    depth: 1.5 },
      { label: 'Medium to deep',  sub: 'Medium-dark skin or dark hair and eyes',             depth: 2.5 },
      { label: 'Deep',           sub: 'Rich dark skin, black or very dark hair, dark eyes',  depth: 3   },
    ],
  },
  {
    id: 'clarity',
    question: 'Which types of color feel most alive and harmonious on you?',
    options: [
      { label: 'Clear and vivid',      sub: 'Bright, saturated colors energise me',            clarity:  2 },
      { label: 'Muted and earthy',     sub: 'Dusty, toned-down colors feel most natural',      clarity: -2 },
      { label: 'Soft and gentle',      sub: 'Slightly greyed or blended tones suit me best',    clarity: -1 },
      { label: 'Intense and jewel-toned', sub: 'Deep, rich, highly saturated hues look best',  clarity:  3 },
    ],
  },
  {
    id: 'contrast',
    question: 'How much contrast is there between your skin, hair, and eyes?',
    options: [
      { label: 'Very high',    sub: 'A dramatic difference — e.g. very fair skin with black hair', contrast: 3   },
      { label: 'Medium-high',  sub: 'A noticeable difference, but not extreme',                    contrast: 2   },
      { label: 'Soft',         sub: 'A gentle, understated difference',                            contrast: 1.5 },
      { label: 'Low',          sub: 'My features blend harmoniously with little contrast',         contrast: 1   },
    ],
  },
]

function computeSeason(answers) {
  let utSum = 0, utCount = 0
  let depth = 2, clarity = 0, contrast = 2

  for (const ans of answers) {
    if (ans.ut !== undefined) { utSum += ans.ut; utCount++ }
    if (ans.depth   !== undefined) depth   = ans.depth
    if (ans.clarity !== undefined) clarity = ans.clarity
    if (ans.contrast !== undefined) contrast = ans.contrast
  }

  const ut = utCount > 0 ? Math.max(-2, Math.min(2, utSum / utCount)) : 0

  let bestId = null
  let bestDist = Infinity

  for (const [id, p] of Object.entries(PROFILES)) {
    const dist = Math.sqrt(
      3 * (ut - p.ut) ** 2 +
      2 * (depth - p.depth) ** 2 +
      2 * (clarity - p.clarity) ** 2 +
      1 * (contrast - p.contrast) ** 2
    )
    if (dist < bestDist) {
      bestDist = dist
      bestId = id
    }
  }

  return bestId
}

export default function Quiz() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState([])
  const [resultId, setResultId] = useState(null)

  const isResult = resultId !== null
  const q = !isResult ? QUESTIONS[step] : null

  function handleOption(value) {
    const newAnswers = [...answers.slice(0, step), value]
    setAnswers(newAnswers)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setResultId(computeSeason(newAnswers))
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1)
  }

  function reset() {
    setStep(0)
    setAnswers([])
    setResultId(null)
  }

  const season = resultId ? seasons.find((s) => s.id === resultId) : null

  return (
    <div className="page-quiz">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="site-logo">Color Season</Link>
          <nav className="site-nav">
            <Link to="/guide" className="nav-link">Season Guide</Link>
          </nav>
        </div>
      </header>

      <main className="quiz-main">
        {!isResult ? (
          <div className="quiz-container">
            <div className="quiz-progress-track">
              <div
                className="quiz-progress-fill"
                style={{ width: `${(step / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <p className="quiz-step-label">
              Question {step + 1} <span className="quiz-step-of">of {QUESTIONS.length}</span>
            </p>

            <h2 className="quiz-question">{q.question}</h2>
            {q.sub && <p className="quiz-question-sub">{q.sub}</p>}

            <div className="quiz-options">
              {q.options.map((opt, i) => {
                const { label, sub, ...value } = opt
                return (
                  <button
                    key={i}
                    className="quiz-option"
                    onClick={() => handleOption(value)}
                  >
                    <span className="quiz-option-label">{label}</span>
                    <span className="quiz-option-sub">{sub}</span>
                  </button>
                )
              })}
            </div>

            {step > 0 && (
              <button className="quiz-back" onClick={goBack}>
                &#8592; Back
              </button>
            )}
          </div>
        ) : (
          <div className="quiz-result">
            <p className="quiz-result-eyebrow">Your color season is</p>
            <h2 className="quiz-result-name">{season.name}</h2>
            <p className="quiz-result-tagline">{season.tagline}</p>

            <div className="quiz-result-rule" />

            <div className="quiz-result-swatches">
              {season.palettes[0].map((color) => (
                <div
                  key={color.hex}
                  className="quiz-result-swatch"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>

            <p className="quiz-result-desc">{season.description}</p>

            <div className="quiz-result-actions">
              <Link to={`/?season=${season.id}`} className="quiz-cta-primary">
                Explore Your Palette
              </Link>
              <Link to={`/guide#${season.id}`} className="quiz-cta-secondary">
                Read Your Season Guide
              </Link>
            </div>

            <button className="quiz-retake" onClick={reset}>
              Retake the quiz
            </button>
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-rule" />
        <p>Color Season &nbsp;·&nbsp; Personal Color Analysis</p>
      </footer>
    </div>
  )
}
