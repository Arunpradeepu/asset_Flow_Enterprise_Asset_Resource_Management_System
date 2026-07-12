import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'

const statusColor = {
  Pending:  { color: '#d97706', bg: '#fffbeb' },
  Approved: { color: '#16a34a', bg: '#f0fdf4' },
  Rejected: { color: '#dc2626', bg: '#fef2f2' },
}

function AdminRequests() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setRequests(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAction = async (id, status) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setRequests(requests.map(r => r._id === id ? data : r))
    } catch (err) {
      alert(err.message)
    }
  }

  const pending = requests.filter(r => r.status === 'Pending')
  const reviewed = requests.filter(r => r.status !== 'Pending')

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Asset Requests</h1>
      <p style={{ color: '#64748b', marginBottom: '28px', fontSize: '14px' }}>Review and approve employee asset requests.</p>

      {pending.length > 0 && (
        <>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
            Pending ({pending.length})
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
                <th style={th}>Employee</th>
                <th style={th}>Asset</th>
                <th style={th}>Reason</th>
                <th style={th}>Date</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(req => (
                <tr key={req._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={td}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{req.requestedBy?.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{req.requestedBy?.email}</div>
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{req.asset?.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{req.asset?.assetTag}</div>
                  </td>
                  <td style={{ ...td, color: '#64748b', fontSize: '13px' }}>{req.reason || '-'}</td>
                  <td style={{ ...td, fontSize: '13px', color: '#64748b' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td style={td}>
                    <button onClick={() => handleAction(req._id, 'Approved')} style={{
                      marginRight: '8px', padding: '6px 14px', backgroundColor: '#16a34a',
                      color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
                    }}>
                      Approve
                    </button>
                    <button onClick={() => handleAction(req._id, 'Rejected')} style={{
                      padding: '6px 14px', backgroundColor: '#dc2626',
                      color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'
                    }}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {reviewed.length > 0 && (
        <>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>
            Reviewed ({reviewed.length})
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
                <th style={th}>Employee</th>
                <th style={th}>Asset</th>
                <th style={th}>Reason</th>
                <th style={th}>Date</th>
                <th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reviewed.map(req => (
                <tr key={req._id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={td}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{req.requestedBy?.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{req.requestedBy?.email}</div>
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{req.asset?.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>{req.asset?.assetTag}</div>
                  </td>
                  <td style={{ ...td, color: '#64748b', fontSize: '13px' }}>{req.reason || '-'}</td>
                  <td style={{ ...td, fontSize: '13px', color: '#64748b' }}>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td style={td}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      color: statusColor[req.status]?.color,
                      backgroundColor: statusColor[req.status]?.bg
                    }}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {requests.length === 0 && (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          No requests yet.
        </div>
      )}
    </div>
  )
}

const th = { padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }
const td = { padding: '14px 16px' }

export default AdminRequests
