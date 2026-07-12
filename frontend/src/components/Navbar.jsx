function Navbar() {
  const user = {
    name: 'Admin',
    role: 'Admin',
  }

  return (
    <header className="navbar">
      <div>
        <h2>Enterprise Asset Management</h2>
      </div>

      <div className="navbar-user">
        <button className="notification-button" type="button">
          🔔
        </button>

        <div className="user-info">
          <strong>{user.name}</strong>
          <span>{user.role}</span>
        </div>

        <div className="user-avatar">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  )
}

export default Navbar