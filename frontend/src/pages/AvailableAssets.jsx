import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'

function AvailableAssets() {
  const [assets, setAssets] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAvailableAssets()
  }, [])

  const fetchAvailableAssets = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/assets`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setAssets(data.filter(a => a.status === 'Available'))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Available Assets</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>
        Assets ready to be allocated.
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
            <th style={th}>Asset Tag</th>
            <th style={th}>Name</th>
            <th style={th}>Category</th>
            <th style={th}>Serial Number</th>
            <th style={th}>Purchase Date</th>
            <th style={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {assets.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ ...td, textAlign: 'center', color: '#6b7280' }}>
                No available assets
              </td>
            </tr>
          ) : (
            assets.map((asset) => (
              <tr key={asset._id}>
                <td style={td}>{asset.assetTag}</td>
                <td style={td}>{asset.name}</td>
                <td style={td}>{asset.category}</td>
                <td style={td}>{asset.serialNumber || '-'}</td>
                <td style={td}>
                  {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : '-'}
                </td>
                <td style={td}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#d1fae5',
                    color: '#065f46'
                  }}>
                    Available
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const th = { padding: '12px', border: '1px solid #e5e7eb' }
const td = { padding: '12px', border: '1px solid #e5e7eb' }

export default AvailableAssets
