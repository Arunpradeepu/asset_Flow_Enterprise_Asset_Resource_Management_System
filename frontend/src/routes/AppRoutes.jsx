import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Departments from '../pages/Departments'
import Assets from '../pages/Assets'
import Allocation from '../pages/Allocation'
import Bookings from '../pages/Bookings'
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organization" element={<Departments />} /> 
          <Route path="/assets" element={<Assets />} /> 
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/bookings" element={<Bookings />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes