import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'

function AllocationManagement() {
  const [allocations, setAllocations] = useState([])
  const [assets, setAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    asset: '',
    employee: '',
    allocationDate: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchAllocations()
    fetchAssets()
    fetchEmployees()
  }, [statusFilter])

  const fetchAllocations = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = statusFilter ? `${API}/api/allocations?status=${statusFilter}` : `${API}/api/allocations`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAllocations(data)
    } catch (err) {
      console.error('Failed to fetch allocations:', err)
    }
  }

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAssets(data.filter(a => a.status === 'Available'))
    } catch (err) {
      console.error('Failed to fetch assets:', err)
    }
  }

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setEmployees(data)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
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
      const res = await fetch(`${API}/api/allocations`, {
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
      setFormData({ asset: '', employee: '', allocationDate: new Date().toISOString().split('T')[0], notes: '' })
      fetchAllocations()
      fetchAssets()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReturn = async (id) => {
    if (!confirm('Mark this asset as returned?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/allocations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Returned' })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      fetchAllocations()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this allocation?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/allocations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      fetchAllocations()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Asset Allocation</h1>
      <p>Manage asset assignments and returns.</p>

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
          marginBottom: '20px'
        }}
      >
        + Allocate Asset
      </button>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Statuses</option>
          <option value="Allocated">Allocated</option>
          <option value="Returned">Returned</option>
        </select>
      </div>

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
            <h2>Allocate Asset</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Asset *</label>
                <select
                  name="asset"
                  value={formData.asset}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">Select Asset</option>
                  {assets.map(a => (
                    <option key={a._id} value={a._id}>{a.assetTag} - {a.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Employee *</label>
                <select
                  name="employee"
                  value={formData.employee}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => (
                    <option key={e._id} value={e._id}>{e.name} - {e.email}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Allocation Date *</label>
                <input
                  type="date"
                  name="allocationDate"
                  value={formData.allocationDate}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
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
                  Allocate
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

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
            <th style={th}>Asset</th>
            <th style={th}>Employee</th>
            <th style={th}>Department</th>
            <th style={th}>Allocation Date</th>
            <th style={th}>Return Date</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map((alloc) => (
            <tr key={alloc._id}>
              <td style={td}>{alloc.asset.assetTag} {alloc.asset.name}</td>
              <td style={td}>{alloc.employee.name}</td>
              <td style={td}>{alloc.employee.department ? alloc.employee.department.name : '-'}</td>
              <td style={td}>{new Date(alloc.allocationDate).toLocaleDateString()}</td>
              <td style={td}>{alloc.returnDate ? new Date(alloc.returnDate).toLocaleDateString() : '-'}</td>
              <td style={td}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: alloc.status === 'Allocated' ? '#dbeafe' : '#d1fae5',
                  color: alloc.status === 'Allocated' ? '#1e40af' : '#065f46'
                }}>
                  {alloc.status}
                </span>
              </td>
              <td style={td}>
                {alloc.status === 'Allocated' && (
                  <button 
                    onClick={() => handleReturn(alloc._id)}
                    style={{ marginRight: '8px', padding: '4px 12px', cursor: 'pointer', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    Return
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(alloc._id)}
                  style={{ padding: '4px 12px', cursor: 'pointer', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Delete
                </button>
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

export default AllocationManagement
