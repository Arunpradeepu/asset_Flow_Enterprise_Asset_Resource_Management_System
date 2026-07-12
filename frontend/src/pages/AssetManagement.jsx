import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'
const CATEGORIES = ['Laptop', 'Desktop', 'Monitor', 'Phone', 'Tablet', 'Printer', 'Other']
const STATUSES = ['Available', 'Allocated', 'Under Maintenance', 'Retired']

function AssetManagement() {
  const [assets, setAssets] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentAsset, setCurrentAsset] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Laptop',
    status: 'Available',
    description: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setAssets(data)
    } catch (err) {
      console.error('Failed to fetch assets:', err)
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
      const url = editMode ? `${API}/api/assets/${currentAsset._id}` : `${API}/api/assets`
      const method = editMode ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      
      setShowDialog(false)
      setEditMode(false)
      setCurrentAsset(null)
      setFormData({ name: '', category: 'Laptop', status: 'Available', description: '', serialNumber: '', purchaseDate: '', purchasePrice: '' })
      fetchAssets()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (asset) => {
    setCurrentAsset(asset)
    setFormData({
      name: asset.name,
      category: asset.category,
      status: asset.status,
      description: asset.description || '',
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : '',
      purchasePrice: asset.purchasePrice || ''
    })
    setEditMode(true)
    setShowDialog(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this asset?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/assets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message)
      }
      fetchAssets()
    } catch (err) {
      alert(err.message)
    }
  }

  const openAddDialog = () => {
    setEditMode(false)
    setCurrentAsset(null)
    setFormData({ name: '', category: 'Laptop', status: 'Available', description: '', serialNumber: '', purchaseDate: '', purchasePrice: '' })
    setShowDialog(true)
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Asset Management</h1>

      <button 
        onClick={openAddDialog}
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
        + Add Asset
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
            width: '500px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>{editMode ? 'Edit Asset' : 'Add Asset'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name *</label>
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
                <label style={{ display: 'block', marginBottom: '5px' }}>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {STATUSES.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Serial Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Purchase Price</label>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleChange}
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
                  {editMode ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false)
                    setError('')
                    setEditMode(false)
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
            <th style={th}>Asset Tag</th>
            <th style={th}>Name</th>
            <th style={th}>Category</th>
            <th style={th}>Status</th>
            <th style={th}>Assigned To</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset._id}>
              <td style={td}>{asset.assetTag}</td>
              <td style={td}>{asset.name}</td>
              <td style={td}>{asset.category}</td>
              <td style={td}>{asset.status}</td>
              <td style={td}>{asset.assignedTo ? asset.assignedTo.name : '-'}</td>
              <td style={td}>
                <button 
                  onClick={() => handleEdit(asset)}
                  style={{ marginRight: '8px', padding: '4px 12px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(asset._id)}
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

export default AssetManagement
