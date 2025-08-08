import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Header = () => {
  const { user, logout, bookings } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const getDashboardPath = () => {
    if (!user) return '/'
    switch (user.role) {
      case 'customer':
        return '/providers'
      case 'provider':
        return '/provider-dashboard'
      case 'admin':
        return '/admin-dashboard'
      default:
        return '/'
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-700 transition">
            BookMyAppointment
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md transition font-medium ${
                isActive('/') 
                  ? 'bg-red-600 text-white' 
                  : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                {/* Role-based navigation */}
                {user.role === 'customer' && (
                  <>
                    <Link
                      to="/providers"
                      className={`px-4 py-2 rounded-md transition font-medium ${
                        isActive('/providers') 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      Browse Providers
                    </Link>
                    
                    <Link
                      to="/my-bookings"
                      className={`px-4 py-2 rounded-md transition font-medium relative ${
                        isActive('/my-bookings') 
                          ? 'bg-red-600 text-white' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      My Bookings
                      {bookings.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {bookings.length}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                {user.role === 'provider' && (
                  <Link
                    to="/provider-dashboard"
                    className={`px-4 py-2 rounded-md transition font-medium ${
                      isActive('/provider-dashboard') 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Provider Dashboard
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className={`px-4 py-2 rounded-md transition font-medium ${
                      isActive('/admin-dashboard') 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">
                      {user.name} 
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full capitalize">
                        {user.role}
                      </span>
                    </p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition font-medium"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/"
                className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>

              {user ? (
                <>
                  {user.role === 'customer' && (
                    <>
                      <Link
                        to="/providers"
                        className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Browse Providers
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        My Bookings ({bookings.length})
                      </Link>
                    </>
                  )}

                  {user.role === 'provider' && (
                    <Link
                      to="/provider-dashboard"
                      className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Provider Dashboard
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin-dashboard"
                      className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <div className="px-4 py-2 border-t border-gray-200 mt-2">
                    <p className="font-medium text-gray-800">
                      {user.name} ({user.role})
                    </p>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <button
                      onClick={() => {
                        handleLogout()
                        setShowMobileMenu(false)
                      }}
                      className="mt-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Book Appointment
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
