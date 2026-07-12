function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin. Here is your organization overview.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span>Available Assets</span>
          <strong>120</strong>
        </div>

        <div className="kpi-card">
          <span>Allocated Assets</span>
          <strong>54</strong>
        </div>

        <div className="kpi-card">
          <span>Under Maintenance</span>
          <strong>8</strong>
        </div>

        <div className="kpi-card">
          <span>Active Bookings</span>
          <strong>15</strong>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>Recent Activities</h3>
        <p>Activity data will be displayed here.</p>
      </div>
    </div>
  )
}

export default Dashboard