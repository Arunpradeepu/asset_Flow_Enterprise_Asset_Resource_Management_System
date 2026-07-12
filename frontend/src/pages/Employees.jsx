import { useEffect, useState } from 'react'

const ROLES = ['employee', 'asset_manager', 'department_head']
const API = 'http://localhost:5000'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setEmployees(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/employees/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setEmployees(employees.map(emp => emp._id === id ? { ...emp, role: newRole } : emp))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Employees</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Department</th>
            <th style={th}>Status</th>
            <th style={th}>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td style={td}>{emp.name}</td>
              <td style={td}>{emp.email}</td>
              <td style={td}>{emp.department ? emp.department.name : '-'}</td>
              <td style={td}>{emp.status}</td>
              <td style={td}>
                <select
                  value={emp.role}
                  onChange={(e) => handleRoleChange(emp._id, e.target.value)}
                  style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const th = { padding: '12px', border: '1px solid #e5e7eb' }
const td = { padding: '12px', border: '1px solid #e5e7eb' }

export default Employees
