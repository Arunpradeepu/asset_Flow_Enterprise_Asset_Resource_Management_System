import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API = 'http://localhost:5000'

const cardConfig = [
  { key: 'totalAssets',       label: 'Total Assets',       color: '#2563eb', bg: '#eff6ff', path: '/admin/assets' },
  { key: 'availableAssets',   label: 'Available Assets',   color: '#16a34a', bg: '#f0fdf4', path: '/admin/available-assets' },
  { key: 'allocatedAssets',   label: 'Allocated Assets',   color: '#d97706', bg: '#fffbeb', path: '/admin/allocations' },
  { key: 'totalEmployees',    label: 'Total Employees',    color: '#7c3aed', bg: '#f5f3ff', path: '/admin/employees' },
  { key: 'totalDepartments',  label: 'Departments',        color: '#0891b2', bg: '#ecfeff', path: '/admin/departments' },
  { key: 'activeAllocations', label: 'Active Allocations', color: '#dc2626', bg: '#fef2f2', path: '/admin/allocations' },
]

function AdminDashboard() {
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'Admin')
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1100px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
          {greeting}, {userName}
        </h1>
        <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
          Here's an overview of your asset management system.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '40px'
      }}>
        {cardConfig.map(({ key, label, icon, color, bg, path }) => (
          <div
            key={key}
            onClick={() => navigate(path)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 8px' }}>{label}</p>
                <p style={{ fontSize: '32px', fontWeight: '700', color, margin: 0, lineHeight: 1 }}>
                  {stats ? stats[key] : '—'}
                </p>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { label: '+ Add Asset', path: '/admin/assets', color: '#2563eb' },
            { label: '+ Allocate Asset', path: '/admin/allocations', color: '#16a34a' },
            { label: '+ Add Department', path: '/admin/departments', color: '#7c3aed' },
            { label: '🤖 Ask AI', path: '/admin/ai', color: '#0891b2' },
          ].map(({ label, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: `1.5px solid ${color}`,
                backgroundColor: 'white',
                color,
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = color
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white'
                e.currentTarget.style.color = color
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
