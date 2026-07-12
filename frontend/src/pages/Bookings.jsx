import { useState } from 'react'

const initialBookings = [
  {
    id: 1,
    resource: 'Conference Room A',
    employee: 'Arun Kumar',
    bookingDate: '2026-07-15',
    startTime: '10:00',
    endTime: '11:00',
    status: 'Approved',
  },
  {
    id: 2,
    resource: 'Projector 01',
    employee: 'Priya S',
    bookingDate: '2026-07-16',
    startTime: '14:00',
    endTime: '16:00',
    status: 'Pending',
  },
]

function Bookings() {
  const [bookings, setBookings] = useState(initialBookings)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    resource: '',
    employee: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
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

    setBookings((previousBookings) => [
      ...previousBookings,
      {
        id: Date.now(),
        ...formData,
      },
    ])

    setFormData({
      resource: '',
      employee: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      status: 'Pending',
    })

    setShowForm(false)
  }

  const handleDelete = (id) => {
    setBookings((previousBookings) =>
      previousBookings.filter((booking) => booking.id !== id),
    )
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchValue = search.toLowerCase()

    const matchesSearch =
      booking.resource.toLowerCase().includes(searchValue) ||
      booking.employee.toLowerCase().includes(searchValue)

    const matchesStatus =
      statusFilter === 'All' || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="organization-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage asset and resource bookings.</p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(!showForm)}
        >
          + Create Booking
        </button>
      </div>

      {showForm && (
        <form className="department-form" onSubmit={handleSubmit}>
          <h3>Create Booking</h3>

          <div className="form-grid">
            <input
              type="text"
              name="resource"
              placeholder="Asset or resource name"
              value={formData.resource}
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
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-button">
              Save Booking
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
            placeholder="Search resource or employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.resource}</td>
                  <td>{booking.employee}</td>
                  <td>{booking.bookingDate}</td>
                  <td>
                    {booking.startTime} - {booking.endTime}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="action-button">
                      Edit
                    </button>

                    <button
                      type="button"
                      className="action-button delete"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-message">
                    No bookings found.
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

export default Bookings