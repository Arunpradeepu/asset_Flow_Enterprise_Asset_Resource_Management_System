import { useState } from 'react'

const initialDepartments = [
  {
    id: 1,
    name: 'Information Technology',
    head: 'Arun Kumar',
    parent: 'Engineering',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Human Resources',
    head: 'Priya S',
    parent: '-',
    status: 'Active',
  },
]

function Departments() {
  const [departments, setDepartments] = useState(initialDepartments)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    head: '',
    parent: '',
    status: 'Active',
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

    const newDepartment = {
      id: Date.now(),
      ...formData,
      parent: formData.parent || '-',
    }

    setDepartments((previousDepartments) => [
      ...previousDepartments,
      newDepartment,
    ])

    setFormData({
      name: '',
      head: '',
      parent: '',
      status: 'Active',
    })

    setShowForm(false)
  }

  const handleDelete = (id) => {
    setDepartments((previousDepartments) =>
      previousDepartments.filter((department) => department.id !== id),
    )
  }

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="organization-header">
        <div>
          <h1>Departments</h1>
          <p>Manage departments and organizational structure.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Department
        </button>
      </div>

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <h3>Add Department</h3>

          <div className="form-grid">
            <input
              type="text"
              name="name"
              placeholder="Department name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="head"
              placeholder="Department head"
              value={formData.head}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="parent"
              placeholder="Parent department"
              value={formData.parent}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Department
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
        <div className="table-toolbar">
          <input
            type="search"
            placeholder="Search departments..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Head</th>
                <th>Parent Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map((department) => (
                <tr key={department.id}>
                  <td>{department.name}</td>
                  <td>{department.head}</td>
                  <td>{department.parent}</td>
                  <td>
                    <span
                      className={`status-badge ${department.status.toLowerCase()}`}
                    >
                      {department.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="action-button">
                      Edit
                    </button>

                    <button
                      type="button"
                      className="action-button delete"
                      onClick={() => handleDelete(department.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredDepartments.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-message">
                    No departments found.
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

export default Departments