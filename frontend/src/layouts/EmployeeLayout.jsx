import { Outlet, NavLink } from 'react-router-dom'

function EmployeeLayout() {
  const userName = localStorage.getItem('userName') || 'Employee'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Top nav */}
      <div style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#3b82f6' }}>AssetFlow</span>
          {[
            { label: 'Available Assets', path: '/employee/assets' },
            { label: 'My Requests', path: '/employee/requests' },
          ].map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                color: isActive ? 'white' : '#94a3b8',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '400',
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                paddingBottom: '4px'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{userName}</span>
          <button
            onClick={() => { localStorage.clear(); window.location.href = '/login' }}
            style={{
              padding: '6px 14px',
              backgroundColor: 'transparent',
              color: '#f87171',
              border: '1px solid #f87171',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <main style={{ padding: '32px 24px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default EmployeeLayout
