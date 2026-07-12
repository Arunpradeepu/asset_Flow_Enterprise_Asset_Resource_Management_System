const assets = [
  {
    id: 'AST-001',
    name: 'Dell Latitude 5440',
    category: 'Laptop',
    status: 'Allocated',
  },
  {
    id: 'AST-002',
    name: 'HP Monitor 24"',
    category: 'Monitor',
    status: 'Available',
  },
  {
    id: 'AST-003',
    name: 'Logitech Keyboard',
    category: 'Peripheral',
    status: 'Maintenance',
  },
]

function EmployeeAssets() {
  return (
    <div className="employee-assets-page">
      <div className="organization-header">
        <div>
          <h1>Available Assets</h1>
          <p>View organization assets and their current status.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {assets.map((asset) => (
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
                  <td>
                    {asset.status === 'Available' ? (
                      <button className="primary-button">
                        Request Asset
                      </button>
                    ) : (
                      <span>Not Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeeAssets