import { useState } from 'react'

const initialAudits = [
  {
    id: 'AUD-001',
    assetId: 'AST-001',
    assetName: 'Dell Latitude 5440',
    auditor: 'Arun Kumar',
    auditDate: '2026-07-10',
    findings: 'Asset is in good condition.',
    status: 'Compliant',
  },
  {
    id: 'AUD-002',
    assetId: 'AST-004',
    assetName: 'HP EliteBook',
    auditor: 'Priya S',
    auditDate: '2026-07-11',
    findings: 'Warranty documents need verification.',
    status: 'Pending',
  },
]

function Audits() {
  const [audits, setAudits] = useState(initialAudits)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    assetId: '',
    assetName: '',
    auditor: '',
    auditDate: '',
    findings: '',
    status: 'Pending',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    setAudits((previousAudits) => [
      ...previousAudits,
      { ...formData },
    ])

    setFormData({
      id: '',
      assetId: '',
      assetName: '',
      auditor: '',
      auditDate: '',
      findings: '',
      status: 'Pending',
    })

    setShowForm(false)
  }

  const handleDelete = (id) => {
    setAudits((previousAudits) =>
      previousAudits.filter((audit) => audit.id !== id),
    )
  }

  const filteredAudits = audits.filter((audit) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      audit.id.toLowerCase().includes(searchValue) ||
      audit.assetId.toLowerCase().includes(searchValue) ||
      audit.assetName.toLowerCase().includes(searchValue) ||
      audit.auditor.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' || audit.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="organization-header">
        <div>
          <h1>Audits</h1>
          <p>Manage asset audit records and compliance status.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Create Audit
        </button>
      </div>

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <h3>Create Audit Record</h3>

          <div className="form-grid">
            <input
              name="id"
              placeholder="Audit ID"
              value={formData.id}
              onChange={handleChange}
              required
            />

            <input
              name="assetId"
              placeholder="Asset ID"
              value={formData.assetId}
              onChange={handleChange}
              required
            />

            <input
              name="assetName"
              placeholder="Asset name"
              value={formData.assetName}
              onChange={handleChange}
              required
            />

            <input
              name="auditor"
              placeholder="Auditor name"
              value={formData.auditor}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="auditDate"
              value={formData.auditDate}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Compliant">Compliant</option>
              <option value="Non-Compliant">Non-Compliant</option>
            </select>

            <textarea
              name="findings"
              placeholder="Audit findings"
              value={formData.findings}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Audit
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-card">
        <div className="asset-toolbar">
          <input
            type="search"
            placeholder="Search audit, asset or auditor..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Compliant">Compliant</option>
            <option value="Non-Compliant">Non-Compliant</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Asset</th>
                <th>Auditor</th>
                <th>Audit Date</th>
                <th>Findings</th>
                <th>Compliance</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAudits.map((audit) => (
                <tr key={audit.id}>
                  <td>{audit.id}</td>

                  <td>
                    <strong>{audit.assetId}</strong>
                    <br />
                    {audit.assetName}
                  </td>

                  <td>{audit.auditor}</td>
                  <td>{audit.auditDate}</td>
                  <td>{audit.findings}</td>

                  <td>
                    <span
                      className={`status-badge ${audit.status
                        .toLowerCase()
                        .replace('non-compliant', 'non-compliant')}`}
                    >
                      {audit.status}
                    </span>
                  </td>

                  <td>
                    <button type="button" className="action-button">
                      Edit
                    </button>

                    <button
                      type="button"
                      className="action-button delete"
                      onClick={() => handleDelete(audit.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAudits.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Audits