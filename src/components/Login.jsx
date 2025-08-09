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
    <div className="app-surface flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            <span className="gradient-brand">QuickBooker</span>
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Choose your role to access the appropriate dashboard
          </p>
        </div>
        
        {/* Demo Credentials */}
        <div className="card-base p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Demo Credentials:</h3>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-gray-700">
                <strong>Customer:</strong> customer@test.com / password
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-gray-700">
                <strong>Provider:</strong> provider@test.com / password
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 rounded border border-blue-200 dark:border-gray-700">
                <strong>Admin:</strong> admin@test.com / password
              </div>
            </div>
          </div>
        </div>

        <form className="card-base p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md btn btn-primary"
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
