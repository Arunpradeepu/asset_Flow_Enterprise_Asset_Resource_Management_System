import { useState } from 'react'

const initialAssets = [
  {
    id: 'AST-001',
    name: 'Dell Latitude 5440',
    category: 'Laptop',
    status: 'Allocated',
    assignedTo: 'Arun Kumar',
  },
  {
    id: 'AST-002',
    name: 'HP Monitor 24"',
    category: 'Monitor',
    status: 'Available',
    assignedTo: '-',
  },
  {
    id: 'AST-003',
    name: 'Logitech Keyboard',
    category: 'Peripheral',
    status: 'Maintenance',
    assignedTo: '-',
  },
]

function Assets() {
  const [assets, setAssets] = useState(initialAssets)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    status: 'Available',
    assignedTo: '',
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

    setAssets((previousAssets) => [
      ...previousAssets,
      {
        ...formData,
        assignedTo: formData.assignedTo || '-',
      },
    ])

    setFormData({
      id: '',
      name: '',
      category: '',
      status: 'Available',
      assignedTo: '',
    })

    setShowForm(false)
  }

  const handleDelete = (id) => {
    setAssets((previousAssets) =>
      previousAssets.filter((asset) => asset.id !== id),
    )
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.id.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || asset.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="organization-header">
        <div>
          <h1>Assets</h1>
          <p>Manage and track organization assets.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Asset
        </button>
      </div>

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <h3>Add Asset</h3>

          <div className="form-grid">
            <input
              type="text"
              name="id"
              placeholder="Asset ID"
              value={formData.id}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Asset name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Allocated">Allocated</option>
              <option value="Maintenance">Maintenance</option>
            </select>

            <input
              type="text"
              name="assignedTo"
              placeholder="Assigned to"
              value={formData.assignedTo}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Asset
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
            placeholder="Search by asset ID or name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <td>{asset.id}</td>
                  <td>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td>
                    <span
                      className={`status-badge ${asset.status.toLowerCase()}`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td>{asset.assignedTo}</td>
                  <td>
                    <button type="button" className="action-button">
                      Edit
                    </button>

                    <button
                      type="button"
                      className="action-button delete"
                      onClick={() => handleDelete(asset.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-message">
                    No assets found.
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

export default Assets