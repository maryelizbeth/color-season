import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SeasonGuide from './pages/SeasonGuide.jsx'
import Quiz from './pages/Quiz.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guide" element={<SeasonGuide />} />
      <Route path="/guide/:seasonId" element={<SeasonGuide />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  )
}
