import { useEffect, useState } from 'react'

const API = 'http://localhost:5000'

const statusColor = {
  Pending:  { color: '#d97706', bg: '#fffbeb' },
  Approved: { color: '#16a34a', bg: '#f0fdf4' },
  Rejected: { color: '#dc2626', bg: '#fef2f2' },
}

function EmployeeRequests() {
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

  return (
    <div style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>My Requests</h1>
      <p style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}>Track the status of your asset requests.</p>

      {requests.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          No requests yet.
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', textAlign: 'left' }}>
              <th style={th}>Asset</th>
              <th style={th}>Reason</th>
              <th style={th}>Date</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id} style={{ borderTop: '1px solid #f1f5f9' }}>
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
      )}
    </div>
  )
}

const th = { padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }
const td = { padding: '14px 16px' }

export default EmployeeRequests
