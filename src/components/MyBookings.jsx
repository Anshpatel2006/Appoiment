import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const MyBookings = () => {
  const { bookings, cancelBooking, formatPrice } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const message = location.state?.message

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      case 'Completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isUpcoming = (date, time) => {
    const appointmentDateTime = new Date(`${date} ${time}`)
    return appointmentDateTime > new Date()
  }

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'Confirmed' && isUpcoming(booking.date, booking.time)
  )
  
  const pastBookings = bookings.filter(booking => 
    booking.status !== 'Confirmed' || !isUpcoming(booking.date, booking.time)
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your appointments and booking history</p>
        </div>
        <button
          onClick={() => navigate('/providers')}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Book New Appointment
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-500">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No bookings yet</h3>
          <p className="text-gray-600 mb-6">Start by browsing available healthcare providers</p>
          <button
            onClick={() => navigate('/providers')}
            className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition font-medium"
          >
            Browse Providers
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upcoming Appointments ({upcomingBookings.length})
              </h2>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-green-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {booking.providerName}
                          </h3>
                          <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{booking.providerType}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block">Date:</span>
                            <p className="font-medium text-gray-800">{formatDate(booking.date)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Time:</span>
                            <p className="font-medium text-gray-800">{booking.time}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Service:</span>
                            <p className="font-medium text-gray-800">{booking.service}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Booking ID:</span>
                            <p className="font-medium text-gray-800">#{booking.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        <button
                          onClick={() => navigate(`/booking/${booking.providerId}`)}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                              cancelBooking(booking.id)
                            }
                          }}
                          className="px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Booking History ({pastBookings.length})
              </h2>
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-gray-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {booking.providerName}
                          </h3>
                          <span className={`ml-3 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{booking.providerType}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 block">Date:</span>
                            <p className="font-medium text-gray-800">{formatDate(booking.date)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Time:</span>
                            <p className="font-medium text-gray-800">{booking.time}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Service:</span>
                            <p className="font-medium text-gray-800">{booking.service}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 block">Booking ID:</span>
                            <p className="font-medium text-gray-800">#{booking.id}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => navigate(`/booking/${booking.providerId}`)}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition text-sm"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyBookings
