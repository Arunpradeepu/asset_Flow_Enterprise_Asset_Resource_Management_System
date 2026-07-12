import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'

function EmployeeAssets() {
  const [assets, setAssets] = useState([])
  const [requestingId, setRequestingId] = useState(null)
  const [reason, setReason] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
      setAssets(data.filter(a => a.status === 'Available'))
    } catch (err) {
      console.error(err)
    }
  }

  const openRequest = (asset) => {
    setSelectedAsset(asset)
    setReason('')
    setError('')
    setShowDialog(true)
  }

  const handleRequest = async (e) => {
    e.preventDefault()
    setError('')
    setRequestingId(selectedAsset._id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ asset: selectedAsset._id, reason })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setShowDialog(false)
      setSuccess(`Request submitted for ${selectedAsset.name}`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setRequestingId(null)
    }
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Available Assets</h1>
      <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Browse and request assets available for allocation.</p>

      {success && (
        <div style={{ padding: '12px 16px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#16a34a', marginBottom: '16px', fontSize: '14px' }}>
          {success}
        </div>
      )}

      {assets.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          No available assets at the moment.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {assets.map(asset => (
            <div key={asset._id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '3px 8px', borderRadius: '20px' }}>
                  {asset.assetTag}
                </span>
                <span style={{ fontSize: '11px', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '3px 8px', borderRadius: '20px' }}>
                  Available
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px' }}>{asset.name}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px' }}>{asset.category}</p>
              <button
                onClick={() => openRequest(asset)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                Request Asset
              </button>
            </div>
          ))}
        </div>
      )}

      {showDialog && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '12px', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>Request Asset</h2>
            <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
              {selectedAsset?.assetTag} — {selectedAsset?.name}
            </p>
            {error && <p style={{ color: 'red', fontSize: '13px', marginBottom: '12px' }}>{error}</p>}
            <form onSubmit={handleRequest}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '6px', fontWeight: '500' }}>
                  Reason (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={3}
                  placeholder="Why do you need this asset?"
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={!!requestingId} style={{
                  flex: 1, padding: '10px', backgroundColor: '#2563eb', color: 'white',
                  border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                }}>
                  {requestingId ? 'Submitting...' : 'Submit Request'}
                </button>
                <button type="button" onClick={() => setShowDialog(false)} style={{
                  flex: 1, padding: '10px', backgroundColor: '#f1f5f9', color: '#374151',
                  border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '14px'
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeAssets
