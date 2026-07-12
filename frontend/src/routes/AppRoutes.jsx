import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AdminLayout from '../layouts/AdminLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import EmployeeLayout from '../layouts/EmployeeLayout'

import Login from '../pages/Login'
import Signup from '../pages/Signup'

import AdminDashboard from '../pages/AdminDashboard'
import DepartmentManagement from '../pages/DepartmentManagement'
import Employees from '../pages/Employees'
import AssetManagement from '../pages/AssetManagement'
import AllocationManagement from '../pages/AllocationManagement'
import AvailableAssets from '../pages/AvailableAssets'
import AIQuery from '../pages/AIQuery'
import AdminRequests from '../pages/AdminRequests'

import EmployeeAssets from '../pages/EmployeeAssets'
import EmployeeRequests from '../pages/EmployeeRequests'

import Dashboard from '../pages/Dashboard'
import Departments from '../pages/Departments'
import Assets from '../pages/Assets'
import Allocation from '../pages/Allocation'
import Bookings from '../pages/Bookings'
import Maintenance from '../pages/Maintenance'
import Audits from '../pages/Audits'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/departments" element={<DepartmentManagement />} />
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/assets" element={<AssetManagement />} />
          <Route path="/admin/allocations" element={<AllocationManagement />} />
          <Route path="/admin/available-assets" element={<AvailableAssets />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/admin/ai" element={<AIQuery />} />
        </Route>

        {/* Employee routes */}
        <Route element={<EmployeeLayout />}>
          <Route path="/employee/assets" element={<EmployeeAssets />} />
          <Route path="/employee/requests" element={<EmployeeRequests />} />
        </Route>

        {/* Legacy dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organization" element={<Departments />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/allocation" element={<Allocation />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/audits" element={<Audits />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
