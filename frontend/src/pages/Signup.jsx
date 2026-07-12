import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../services/auth'
import '../App.css'

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const data = await signup(formData.name, formData.email, formData.password)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('userName', data.user.name)
      localStorage.setItem('userId', data.user.id)
      navigate('/employee/assets')
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <div className="brand-icon">AF</div>
          <h1>AssetFlow</h1>
          <p>Create your employee account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p className="error-message" style={{ color: 'red', marginBottom: '8px' }}>{error}</p>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" name="name" value={formData.name}
              onChange={handleChange} placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter password" required />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} placeholder="Confirm password" required />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '14px' }}>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
