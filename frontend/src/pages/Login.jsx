import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'
import { login } from '../services/auth'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const data = await login(formData.username, formData.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('userName', data.user.name)
      localStorage.setItem('userId', data.user.id)
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/employee/assets')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">AF</div>
          <h1>AssetFlow</h1>
          <p>Enterprise Asset & Resource Management</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input id="username" type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Enter your email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter your password" required />
          </div>
          {error && <p style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}
          <button type="submit" className="login-button">Sign In</button>
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px' }}>
            No account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login