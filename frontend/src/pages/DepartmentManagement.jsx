import { useEffect, useState } from 'react'

function DepartmentManagement() {
  const [showDialog, setShowDialog] = useState(false)
  const [departments, setDepartments] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    parentDepartment: '',
    status: 'Active'
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setDepartments(data)
    } catch (err) {
      console.error('Failed to fetch departments:', err)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      
      setShowDialog(false)
      setFormData({ name: '', head: '', parentDepartment: '', status: 'Active' })
      fetchDepartments()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Department Management</h1>

      <button 
        onClick={() => setShowDialog(true)}
        style={{
          padding: '12px 24px',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          marginTop: '20px',
          marginBottom: '30px'
        }}
      >
        Add Department
      </button>

      {showDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h2>Add Department</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Department Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Head (User ID)</label>
                <input
                  type="text"
                  name="head"
                  value={formData.head}
                  onChange={handleChange}
                  placeholder="Optional"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Parent Department ID</label>
                <input
                  type="text"
                  name="parentDepartment"
                  value={formData.parentDepartment}
                  onChange={handleChange}
                  placeholder="Optional"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false)
                    setError('')
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h2>Departments</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Department Name</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Head</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Parent Department</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '12px', border: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id}>
                <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{dept.name}</td>
                <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                  {dept.head ? dept.head.name : '-'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                  {dept.parentDepartment ? dept.parentDepartment.name : '-'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>{dept.status}</td>
                <td style={{ padding: '12px', border: '1px solid #e5e7eb' }}>
                  <button style={{ marginRight: '8px', padding: '4px 12px', cursor: 'pointer' }}>Edit</button>
                  <button style={{ padding: '4px 12px', cursor: 'pointer', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DepartmentManagement
