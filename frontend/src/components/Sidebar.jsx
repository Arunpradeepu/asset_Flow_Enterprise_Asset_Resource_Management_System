    import { NavLink } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Organization', path: '/organization' },
  { name: 'Assets', path: '/assets' },
  { name: 'Allocation', path: '/allocation' },
  { name: 'Bookings', path: '/bookings' },
  { name: 'Maintenance', path: '/maintenance' },
  { name: 'Audits', path: '/audits' },
  { name: 'Reports', path: '/reports' },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">AF</div>
        <span>AssetFlow</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar