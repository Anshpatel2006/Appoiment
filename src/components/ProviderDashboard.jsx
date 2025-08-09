import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const ProviderDashboard = () => {
  const { 
    user, 
    allProviders, 
    allBookings, 
    formatPrice, 
    generateTimeSlots,
    cancelBooking 
  } = useApp()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDate, setSelectedDate] = useState('')
  const [blockedSlots, setBlockedSlots] = useState([])
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  
  // Get provider data for current user
  const currentProvider = allProviders.find(p => p.id === user?.providerId)
  
  // Get bookings for this provider
  const providerBookings = allBookings.filter(booking => booking.providerId === user?.providerId)
  
  // Get upcoming bookings
  const upcomingBookings = providerBookings.filter(booking => {
    const appointmentDate = new Date(`${booking.date} ${booking.time}`)
    return appointmentDate > new Date() && booking.status === 'Confirmed'
  })
  
  // Get today's bookings
  const today = new Date().toISOString().split('T')[0]
  const todayBookings = providerBookings.filter(booking => 
    booking.date === today && booking.status === 'Confirmed'
  )
  
  const getStats = () => {
    const totalRevenue = providerBookings
      .filter(booking => booking.status === 'Confirmed')
      .reduce((sum, booking) => sum + (currentProvider?.price || 0), 0)
    
    const thisMonthBookings = providerBookings.filter(booking => {
      const bookingDate = new Date(booking.date)
      const now = new Date()
      return bookingDate.getMonth() === now.getMonth() && 
             bookingDate.getFullYear() === now.getFullYear()
    })
    
    return {
      totalBookings: providerBookings.length,
      confirmedBookings: providerBookings.filter(b => b.status === 'Confirmed').length,
      todayBookings: todayBookings.length,
      thisMonthRevenue: thisMonthBookings
        .filter(b => b.status === 'Confirmed')
        .reduce((sum, booking) => sum + (currentProvider?.price || 0), 0),
      totalRevenue
    }
  }
  
  const stats = getStats()
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  
  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId)
    }
  }

  const handleBlockTimeSlot = (date, time) => {
    const slotKey = `${date}-${time}`
    setBlockedSlots(prev => [...prev, slotKey])
  }

  const handleUnblockTimeSlot = (date, time) => {
    const slotKey = `${date}-${time}`
    setBlockedSlots(prev => prev.filter(slot => slot !== slotKey))
  }

  const isSlotBlocked = (date, time) => {
    const slotKey = `${date}-${time}`
    return blockedSlots.includes(slotKey)
  }
  
  // Generate available dates for the next 30 days
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }
  
  const availableDates = getAvailableDates()
  
  if (!currentProvider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Provider Profile Not Found</h2>
          <p className="text-red-600">
            Your account is not linked to a provider profile. Please contact the administrator.
          </p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="section-title mb-1">Provider Dashboard</h1>
          <p className="section-subtitle">Manage your appointments and services</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
            <p className="font-medium text-gray-800 dark:text-gray-100">{user?.name}</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'P'}
          </div>
        </div>
      </div>

      {/* Provider Info Card */}
      <div className="card-base p-6 mb-8">
        <div className="flex items-center">
          <span className="text-4xl mr-4">{currentProvider.image}</span>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{currentProvider.name}</h2>
            <p className="text-gray-600 dark:text-gray-300">{currentProvider.type} • {currentProvider.location}</p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">{currentProvider.rating}/5</span>
              <span className="text-gray-400 dark:text-gray-500 mx-2">•</span>
              <span className="text-sm font-medium text-green-500">{formatPrice(currentProvider.price)}</span>
              <span className="text-gray-400 dark:text-gray-500 mx-2">•</span>
              <span className="text-sm text-gray-600 dark:text-gray-300">{currentProvider.services.length} services</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Services offered:</p>
          <div className="flex flex-wrap gap-2">
            {currentProvider.services.map((service, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card-base p-6">
          <div className="flex items-center">
            <div className="text-3xl text-blue-600 mr-4">📅</div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="card-base p-6">
          <div className="flex items-center">
            <div className="text-3xl text-green-600 mr-4">✅</div>
            <div>
              <p className="text-sm font-medium text-green-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-300">{stats.confirmedBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="card-base p-6">
          <div className="flex items-center">
            <div className="text-3xl text-yellow-600 mr-4">🕐</div>
            <div>
              <p className="text-sm font-medium text-yellow-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">{stats.todayBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="card-base p-6">
          <div className="flex items-center">
            <div className="text-3xl text-purple-600 mr-4">💰</div>
            <div>
              <p className="text-sm font-medium text-purple-600">This Month Revenue</p>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{formatPrice(stats.thisMonthRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card-base mb-8">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Today\'s Schedule', icon: '📋' },
              { id: 'bookings', label: 'All Bookings', icon: '📅' },
              { id: 'schedule', label: 'Manage Schedule', icon: '🕐' },
              { id: 'analytics', label: 'Analytics', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Today's Schedule Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Today's Appointments</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>

              {todayBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No appointments today</h3>
                  <p className="text-gray-600 dark:text-gray-300">You have a free day! Enjoy your time off.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayBookings
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((booking, index) => (
                    <div key={index} className="card-base p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                            {booking.customerName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{booking.customerName || 'Customer'}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{booking.service}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Phone: {booking.customerPhone || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{formatTime(booking.time)}</p>
                          <p className="text-sm text-green-500">{formatPrice(currentProvider.price)}</p>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
                <div className="text-sm text-gray-500">
                  Total: {providerBookings.length} bookings
                </div>
              </div>

              <div className="space-y-4">
                {providerBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 dark:text-gray-300">Your bookings will appear here once customers start booking.</p>
                  </div>
                ) : (
                  providerBookings
                    .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))
                    .map((booking, index) => (
                    <div key={index} className="card-base border dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-4">
                            {booking.customerName?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{booking.customerName || 'Customer'}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{booking.service}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(booking.date)} at {formatTime(booking.time)}
                            </p>
                            {booking.customerPhone && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">Phone: {booking.customerPhone}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{formatPrice(currentProvider.price)}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                          {booking.status === 'Confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="block mt-2 text-xs text-red-600 hover:text-red-800"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Schedule Management Tab */}
          {activeTab === 'schedule' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Manage Your Schedule</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">Select Date to View Schedule</h4>
                  <div className="space-y-2">
                    {availableDates.slice(0, 7).map(date => {
                      const dateObj = new Date(date)
                      const bookingsForDate = providerBookings.filter(b => b.date === date)
                      
                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`w-full text-left p-3 rounded-lg border transition ${
                            selectedDate === date
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-gray-100">
                                {dateObj.toLocaleDateString('en-IN', { 
                                  weekday: 'long', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {bookingsForDate.length} appointments
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                bookingsForDate.length === 0 ? 'bg-green-100 text-green-800' :
                                bookingsForDate.length <= 3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {bookingsForDate.length === 0 ? 'Free' :
                                 bookingsForDate.length <= 3 ? 'Light' : 'Busy'}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Slots for Selected Date */}
                <div>
                  {selectedDate ? (
                    <>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">
                        Time Slots for {new Date(selectedDate).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {generateTimeSlots(currentProvider.id, selectedDate).map((slot, index) => {
                          const booking = providerBookings.find(b => 
                            b.date === selectedDate && b.time === slot.time
                          )
                          const isBlocked = isSlotBlocked(selectedDate, slot.time)
                          
                          return (
                            <div
                              key={index}
                              className={`p-2 rounded text-center text-sm cursor-pointer transition hover:shadow-md ${
                                booking
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                                  : isBlocked
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                                  : slot.available
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/40'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                              }`}
                              onClick={() => {
                                if (booking) {
                                  setSelectedSlot({ ...booking, date: selectedDate, time: slot.time })
                                  setShowTimeSlotModal(true)
                                } else if (!isBlocked && slot.available) {
                                  handleBlockTimeSlot(selectedDate, slot.time)
                                } else if (isBlocked) {
                                  handleUnblockTimeSlot(selectedDate, slot.time)
                                }
                              }}
                            >
                              <div className="font-medium">{formatTime(slot.time)}</div>
                              <div className="text-xs">
                                {booking ? 'Booked' : 
                                 isBlocked ? 'Blocked' :
                                 slot.available ? 'Available' : 'Unavailable'}
                              </div>
                              {booking && (
                                <div className="text-xs mt-1 truncate">
                                  {booking.customerName || 'Customer'}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      
                      <div className="mt-4 p-3 card-base">
                        <h5 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Time Slot Management:</h5>
                        <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                          <div>• Click on <span className="bg-green-200 px-1 rounded">Available</span> slots to block them</div>
                          <div>• Click on <span className="bg-orange-200 px-1 rounded">Blocked</span> slots to unblock them</div>
                          <div>• Click on <span className="bg-red-200 px-1 rounded">Booked</span> slots to view details</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📅</div>
                      <p className="text-gray-600 dark:text-gray-300">Select a date to view time slots</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-6">Analytics & Insights</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Overview */}
                <div className="card-base p-6">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">Revenue Overview</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Revenue:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{formatPrice(stats.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">This Month:</span>
                      <span className="font-semibold text-green-500">{formatPrice(stats.thisMonthRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Average per Booking:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {formatPrice(stats.confirmedBookings > 0 ? stats.totalRevenue / stats.confirmedBookings : 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Stats */}
                <div className="card-base p-6">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">Booking Statistics</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Total Bookings:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{stats.totalBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Confirmed:</span>
                      <span className="font-semibold text-green-500">{stats.confirmedBookings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Cancelled:</span>
                      <span className="font-semibold text-red-600">
                        {providerBookings.filter(b => b.status === 'Cancelled').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Success Rate:</span>
                      <span className="font-semibold text-blue-600">
                        {stats.totalBookings > 0 
                          ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Popular Services */}
                <div className="card-base p-6">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">Popular Services</h4>
                  <div className="space-y-3">
                    {currentProvider.services.map((service, index) => {
                      const serviceBookings = providerBookings.filter(b => b.service === service).length
                      const percentage = stats.totalBookings > 0 ? (serviceBookings / stats.totalBookings) * 100 : 0
                      
                      return (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{service}</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{serviceBookings}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card-base p-6">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {upcomingBookings.slice(0, 5).map((booking, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{booking.service}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {new Date(booking.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} 
                            at {formatTime(booking.time)}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Upcoming
                        </span>
                      </div>
                    ))}
                    {upcomingBookings.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming bookings</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showTimeSlotModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card-base p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Appointment Details</h3>
              <button
                onClick={() => {
                  setShowTimeSlotModal(false)
                  setSelectedSlot(null)
                }}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="card-base p-4">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                    {selectedSlot.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">{selectedSlot.customerName || 'Customer'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedSlot.customerPhone || 'Phone not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                  <p className="text-gray-800 dark:text-gray-100">{formatDate(selectedSlot.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</label>
                  <p className="text-gray-800 dark:text-gray-100">{formatTime(selectedSlot.time)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</label>
                <p className="text-gray-800 dark:text-gray-100">{selectedSlot.service}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                <p className="text-green-500 font-semibold">{formatPrice(currentProvider.price)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedSlot.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                  selectedSlot.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSlot.status}
                </span>
              </div>

              {selectedSlot.status === 'Confirmed' && (
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      handleCancelBooking(selectedSlot.id)
                      setShowTimeSlotModal(false)
                      setSelectedSlot(null)
                    }}
                    className="flex-1 btn btn-primary bg-red-600 hover:bg-red-700"
                  >
                    Cancel Appointment
                  </button>
                  <button
                    onClick={() => {
                      setShowTimeSlotModal(false)
                      setSelectedSlot(null)
                    }}
                    className="flex-1 btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              )}

              {selectedSlot.status !== 'Confirmed' && (
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setShowTimeSlotModal(false)
                      setSelectedSlot(null)
                    }}
                    className="w-full btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderDashboard
