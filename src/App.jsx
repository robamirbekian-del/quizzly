import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import LessonPage from './pages/LessonPage'
import FormatPage from './pages/FormatPage'
import QuizPage from './pages/QuizPage'
import ResultsPage from './pages/ResultsPage'
import ReviewPage from './pages/ReviewPage'

// ── When you add auth (Supabase), wrap protected routes like this:
//
// function ProtectedRoute({ children }) {
//   const { user } = useAuth()
//   return user ? children : <Navigate to="/login" replace />
// }
//
// Then wrap pages that require login:
// <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />

export default function App() {
  return (
    <>
      <Nav />

      <Routes>
        <Route path="/"           element={<LessonPage />} />
        <Route path="/format"     element={<FormatPage />} />
        <Route path="/quiz"       element={<QuizPage />} />
        <Route path="/results"    element={<ResultsPage />} />
        <Route path="/review/:id" element={<ReviewPage />} />

        {/* Catch-all: redirect any unknown URL back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
