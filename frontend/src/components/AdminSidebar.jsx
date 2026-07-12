import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', path: '/admin', exact: true },
  { label: 'Departments', path: '/admin/departments' },
  { label: 'Employees', path: '/admin/employees' },
  { label: 'Assets', path: '/admin/assets' },
  { label: 'Allocation', path: '/admin/allocations' },
  { label: 'Available Assets', path: '/admin/available-assets' },
  { label: 'Requests', path: '/admin/requests' },
  { label: 'AI Questioning', path: '/admin/ai' },
]

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 2000,
          backgroundColor: '#1e293b',
          color: 'white',
          border: 'none',
          width: '42px',
          height: '42px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1500,
            backdropFilter: 'blur(2px)'
          }}
        />
      )}

      {/* Sidebar panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-280px',
        width: '260px',
        height: '100vh',
        backgroundColor: '#1e293b',
        color: 'white',
        transition: 'left 0.25s ease',
        zIndex: 1600,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
      }}>
        {/* Brand */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid #334155',
          marginTop: '60px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>AF</div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '15px' }}>AssetFlow</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setIsOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: isActive ? 'white' : '#94a3b8',
                backgroundColor: isActive ? '#3b82f6' : 'transparent',
                marginBottom: '2px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.15s'
              })}
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #334155' }}>
          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'transparent',
              color: '#f87171',
              border: '1px solid #f87171',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default AdminSidebar
