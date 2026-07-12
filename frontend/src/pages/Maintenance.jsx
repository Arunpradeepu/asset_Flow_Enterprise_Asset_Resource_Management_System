import { useState } from 'react'

const initialRequests = [
  {
    id: 'MNT-001',
    assetId: 'AST-001',
    assetName: 'Dell Latitude 5440',
    issue: 'Laptop overheating frequently',
    reportedBy: 'Arun Kumar',
    reportedDate: '2026-07-10',
    priority: 'High',
    status: 'In Progress',
  },
  {
    id: 'MNT-002',
    assetId: 'AST-003',
    assetName: 'Logitech Keyboard',
    issue: 'Several keys are not working',
    reportedBy: 'Priya S',
    reportedDate: '2026-07-11',
    priority: 'Medium',
    status: 'Open',
  },
]

function Maintenance() {
  const [requests, setRequests] = useState(initialRequests)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    assetId: '',
    assetName: '',
    issue: '',
    reportedBy: '',
    reportedDate: '',
    priority: 'Medium',
    status: 'Open',
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
    setRequests((previousRequests) => [...previousRequests, formData])

    setFormData({
      id: '',
      assetId: '',
      assetName: '',
      issue: '',
      reportedBy: '',
      reportedDate: '',
      priority: 'Medium',
      status: 'Open',
    })

    setShowForm(false)
  }

  const handleDelete = (id) => {
    setRequests((previousRequests) =>
      previousRequests.filter((request) => request.id !== id),
    )
  }

  const filteredRequests = requests.filter((request) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      request.id.toLowerCase().includes(searchValue) ||
      request.assetId.toLowerCase().includes(searchValue) ||
      request.assetName.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="organization-header">
        <div>
          <h1>Maintenance</h1>
          <p>Track and manage asset maintenance requests.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Create Request
        </button>
      </div>

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <h3>Create Maintenance Request</h3>

          <div className="form-grid">
            <input
              name="id"
              placeholder="Request ID"
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
              name="reportedBy"
              placeholder="Reported by"
              value={formData.reportedBy}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="reportedDate"
              value={formData.reportedDate}
              onChange={handleChange}
              required
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <textarea
              name="issue"
              placeholder="Issue description"
              value={formData.issue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Request
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
            placeholder="Search request or asset..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Asset</th>
                <th>Issue</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>
                    {request.assetId}
                    <br />
                    {request.assetName}
                  </td>
                  <td>{request.issue}</td>
                  <td>{request.reportedBy}</td>
                  <td>{request.reportedDate}</td>
                  <td>
                    <span
                      className={`priority-badge ${request.priority.toLowerCase()}`}
                    >
                      {request.priority}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${request.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="action-button">
                      Edit
                    </button>

                    <button
                      type="button"
                      className="action-button delete"
                      onClick={() => handleDelete(request.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="8" className="empty-message">
                    No maintenance requests found.
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

export default Maintenance