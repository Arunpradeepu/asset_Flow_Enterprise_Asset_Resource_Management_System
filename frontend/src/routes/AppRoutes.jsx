import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes