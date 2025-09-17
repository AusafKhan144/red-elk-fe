import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AssessmentList from './pages/AssessmentList'
import AssessmentView from './pages/AssessmentView'
import Dashboard from './pages/Dashboard'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setToken={setToken} />} />
      <Route path="/" element={token ? <Dashboard token={token} /> : <LoginPage setToken={setToken} />} />
      <Route
        path="/assessments"
        element={token ? <AssessmentList token={token} /> : <LoginPage setToken={setToken} />}
      />
      {token && <Route path="/assessments/:id" element={<AssessmentView token={token} />} />}
    </Routes>
  )
}

export default App