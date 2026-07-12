import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

function AdminLayout() {
  const userName = localStorage.getItem('userName') || 'Admin'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      <AdminSidebar />

      {/* Top bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 24px',
        zIndex: 1000,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{userName}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Admin</div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main style={{ paddingTop: '60px', paddingLeft: '20px', paddingRight: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
