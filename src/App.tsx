import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { VisitReceiptProvider } from './features/receipt/VisitReceiptContext'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Work from './pages/Work'
import Experiments from './pages/Experiments'
import Writing from './pages/Writing'
import About from './pages/About'

export default function App() {
  return (
    <VisitReceiptProvider>
      <Routes>
        <Route index element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="writing" element={<Writing />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </VisitReceiptProvider>
  )
}
