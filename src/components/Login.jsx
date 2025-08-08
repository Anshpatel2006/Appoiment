import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const { login, sampleUsers } = useApp()
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    const result = login(formData.email, formData.password)
    
    if (result.success) {
      // Redirect based on user role
      switch (result.user.role) {
        case 'customer':
          navigate('/providers')
          break
        case 'provider':
          navigate('/provider-dashboard')
          break
        case 'admin':
          navigate('/admin-dashboard')
          break
        default:
          navigate('/')
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-red-600 mb-2">
            BookMyAppointment
          </h1>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your role to access the appropriate dashboard
          </p>
        </div>
        
        {/* Demo Credentials */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-white p-2 rounded border">
                <strong>Customer:</strong> customer@test.com / password
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Provider:</strong> provider@test.com / password
              </div>
              <div className="bg-white p-2 rounded border">
                <strong>Admin:</strong> admin@test.com / password
              </div>
            </div>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
