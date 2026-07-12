import { useState } from 'react'

const initialAllocations = [
  {
    id: 1,
    assetId: 'AST-001',
    assetName: 'Dell Latitude 5440',
    employee: 'Arun Kumar',
    department: 'Information Technology',
    allocationDate: '2026-07-01',
    returnDate: '-',
    status: 'Allocated',
  },
  {
    id: 2,
    assetId: 'AST-004',
    assetName: 'HP EliteBook',
    employee: 'Priya S',
    department: 'Human Resources',
    allocationDate: '2026-06-15',
    returnDate: '2026-07-10',
    status: 'Returned',
  },
]

function Allocation() {
  const [allocations, setAllocations] = useState(initialAllocations)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    assetId: '',
    assetName: '',
    employee: '',
    department: '',
    allocationDate: '',
    returnDate: '',
    status: 'Allocated',
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

    const newAllocation = {
      id: Date.now(),
      ...formData,
      returnDate: formData.returnDate || '-',
    }

    setAllocations((previousAllocations) => [
      ...previousAllocations,
      newAllocation,
    ])

    setFormData({
      assetId: '',
      assetName: '',
      employee: '',
      department: '',
      allocationDate: '',
      returnDate: '',
      status: 'Allocated',
    })

    setShowForm(false)
  }

  const handleDelete = (id) => {
    setAllocations((previousAllocations) =>
      previousAllocations.filter((allocation) => allocation.id !== id),
    )
  }

  const filteredAllocations = allocations.filter((allocation) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      allocation.assetId.toLowerCase().includes(searchValue) ||
      allocation.assetName.toLowerCase().includes(searchValue) ||
      allocation.employee.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' || allocation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="organization-header">
        <div>
          <h1>Asset Allocation</h1>
          <p>Manage asset assignments and returns.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Allocate Asset
        </button>
      </div>

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <h3>Allocate Asset</h3>

          <div className="form-grid">
            <input
              type="text"
              name="assetId"
              placeholder="Asset ID"
              value={formData.assetId}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="assetName"
              placeholder="Asset name"
              value={formData.assetName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="employee"
              placeholder="Employee name"
              value={formData.employee}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="allocationDate"
              value={formData.allocationDate}
              onChange={handleChange}
              required
            />

            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Allocated">Allocated</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Allocation
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
            placeholder="Search asset or employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Allocated">Allocated</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Allocation Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAllocations.map((allocation) => (
                <tr key={allocation.id}>
                  <td>
                    <strong>{allocation.assetId}</strong>
                    <br />
                    {allocation.assetName}
                  </td>
                  <td>{allocation.employee}</td>
                  <td>{allocation.department}</td>
                  <td>{allocation.allocationDate}</td>
                  <td>{allocation.returnDate}</td>
                  <td>
                    <span
                      className={`status-badge ${allocation.status.toLowerCase()}`}
                    >
                      {allocation.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="action-button">
                      Edit
                    </button>

                    <button
                      type="button"
                      className="action-button delete"
                      onClick={() => handleDelete(allocation.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredAllocations.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-message">
                    No allocations found.
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

export default Allocation