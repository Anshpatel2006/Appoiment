import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Header = () => {
  const { user, logout, bookings } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Ensure the document gets the correct theme class on initial load and when toggled
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

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
    <header className="bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-extrabold tracking-tight hover:opacity-90 transition">
            <span className="gradient-brand">QuickBooker</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`${isActive('/') ? 'nav-link nav-link-active' : 'nav-link'}`}
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
                      className={`${isActive('/providers') ? 'nav-link nav-link-active' : 'nav-link'}`}
                    >
                      Browse Providers
                    </Link>
                    
                    <Link
                      to="/my-bookings"
                      className={`relative ${isActive('/my-bookings') ? 'nav-link nav-link-active' : 'nav-link'}`}
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
                    className={`${isActive('/provider-dashboard') ? 'nav-link nav-link-active' : 'nav-link'}`}
                  >
                    Provider Dashboard
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className={`${isActive('/admin-dashboard') ? 'nav-link nav-link-active' : 'nav-link'}`}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200 dark:border-gray-700">
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      {user.name} 
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full capitalize">
                        {user.role}
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="btn btn-ghost"
                  >
                    Logout
                  </button>
                  <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="btn btn-ghost"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDark ? (
                      // Sun icon
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                        <path fillRule="evenodd" d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm10-7a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5 12a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm12.364-7.364a1 1 0 010 1.414L16.95 7.464a1 1 0 11-1.414-1.414l.414-.414a1 1 0 011.414 0zM8.464 16.95a1 1 0 010 1.414l-.414.414A1 1 0 016.636 17.95l.414-.414a1 1 0 011.414 0zM19.536 17.95a1 1 0 01-1.414 0l-.414-.414a1 1 0 111.414-1.414l.414.414a1 1 0 010 1.414zM7.464 6.05a1 1 0 01-1.414 0l-.414-.414A1 1 0 017.05 4.222l.414.414a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      // Moon icon
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.355 2.807-8.06 6.72-9.337a.75.75 0 01.949.966 7.5 7.5 0 009.166 9.166.75.75 0 01.966.949z" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="btn btn-ghost"
                  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
                      <path fillRule="evenodd" d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 17a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm10-7a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5 12a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm12.364-7.364a1 1 0 010 1.414L16.95 7.464a1 1 0 11-1.414-1.414l.414-.414a1 1 0 011.414 0zM8.464 16.95a1 1 0 010 1.414l-.414.414A1 1 0 016.636 17.95l.414-.414a1 1 0 011.414 0zM19.536 17.95a1 1 0 01-1.414 0l-.414-.414a1 1 0 111.414-1.414l.414.414a1 1 0 010 1.414zM7.464 6.05a1 1 0 01-1.414 0l-.414-.414A1 1 0 017.05 4.222l.414.414a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.355 2.807-8.06 6.72-9.337a.75.75 0 01.949.966 7.5 7.5 0 009.166 9.166.75.75 0 01.966.949z" />
                    </svg>
                  )}
                </button>
                <Link
                  to="/login"
                  className="btn btn-ghost"
                >
                  Sign In
                </Link>
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  Book Appointment
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-md btn-ghost"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2 pt-4">
              <Link
                to="/"
                className="btn btn-ghost"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <button
                onClick={() => {
                  toggleTheme()
                  setShowMobileMenu(false)
                }}
                className="btn btn-ghost flex items-center space-x-2"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>

              {user ? (
                <>
                  {user.role === 'customer' && (
                    <>
                      <Link
                        to="/providers"
                        className="btn btn-ghost"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Browse Providers
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="btn btn-ghost"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        My Bookings ({bookings.length})
                      </Link>
                    </>
                  )}

                  {user.role === 'provider' && (
                    <Link
                      to="/provider-dashboard"
                      className="btn btn-ghost"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      Provider Dashboard
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin-dashboard"
                      className="btn btn-ghost"
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
                      className="mt-2 btn btn-ghost text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-primary"
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
