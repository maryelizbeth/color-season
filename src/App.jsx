import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SeasonGuide from './pages/SeasonGuide.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/guide" element={<SeasonGuide />} />
      <Route path="/guide/:seasonId" element={<SeasonGuide />} />
    </Routes>
  )
}
