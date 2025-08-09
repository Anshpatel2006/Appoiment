import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Header from './components/Header'
import Home from './components/Home'
import Login from './components/Login'
import Providers from './components/Providers'
import Booking from './components/Booking'
import MyBookings from './components/MyBookings'
import ProtectedRoute from './components/ProtectedRoute'
import ProviderDashboard from './components/ProviderDashboard'
import AdminDashboard from './components/AdminDashboard'
import HealthInfo from './components/HealthInfo'
import MentalHealth from './components/MentalHealth'

function AppContent() {
  const { user, login } = useApp()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      login(JSON.parse(savedUser))
    }
    // Initialize theme
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDark(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [login])

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
    <Router>
      <div className="app-surface">
        <Header />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={<Home />} 
          />
          <Route 
            path="/health-info" 
            element={<HealthInfo />} 
          />
          <Route 
            path="/mental-health" 
            element={<MentalHealth />} 
          />
          
          <Route 
            path="/login" 
            element={user ? <Navigate to={getDashboardPath()} replace /> : <Login />} 
          />
          
          {/* Customer Routes */}
          <Route 
            path="/providers" 
            element={
              <ProtectedRoute>
                <Providers />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/booking/:providerId" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          
          {/* Provider Routes */}
          <Route 
            path="/provider-dashboard" 
            element={
              <ProtectedRoute>
                <ProviderDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App