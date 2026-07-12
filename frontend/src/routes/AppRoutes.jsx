import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import DashboardLayout from '../layouts/DashboardLayout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Departments from '../pages/Departments'
import Assets from '../pages/Assets'
import Allocation from '../pages/Allocation'
import Bookings from '../pages/Bookings'
import Maintenance from '../pages/Maintenance'
import Audits from '../pages/Audits'
import EmployeeAssets from '../pages/EmployeeAssets'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Employee */}
        <Route path="/employee/assets" element={<EmployeeAssets />} />

        {/* Admin */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/audits" element={<Audits />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes