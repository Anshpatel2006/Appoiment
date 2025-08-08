import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Booking = () => {
  const { providerId } = useParams()
  const navigate = useNavigate()
  const { providers, user, addBooking, generateTimeSlots, formatPrice } = useApp()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedService, setSelectedService] = useState('')
  const [currentStep, setCurrentStep] = useState('date') // date, time, confirm

  const provider = providers.find(p => p.id === parseInt(providerId))

  if (!provider) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Provider not found</h2>
        <button
          onClick={() => navigate('/providers')}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Back to Providers
        </button>
      </div>
    )
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setCurrentStep('time')
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setCurrentStep('confirm')
  }

  const handleBooking = (e) => {
    e.preventDefault()
    
    if (!selectedService) {
      alert('Please select a service')
      return
    }

    const booking = {
      providerId: provider.id,
      providerName: provider.name,
      providerType: provider.type,
      date: selectedDate,
      time: selectedSlot.time,
      service: selectedService,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone
    }

    addBooking(booking)
    navigate('/my-bookings', { 
      state: { message: 'Booking confirmed successfully!' }
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateShort = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/providers')}
          className="text-red-600 hover:text-red-700 mr-4"
        >
          ← Back to Providers
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{provider.name}</h1>
          <p className="text-gray-600">{provider.type} • {provider.location}</p>
          <div className="flex items-center mt-1">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 ml-1">{provider.rating}/5</span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-sm font-medium text-green-600">{formatPrice(provider.price)}</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${currentStep === 'date' ? 'text-red-600' : selectedDate ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'date' ? 'bg-red-600 text-white' : 
              selectedDate ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="ml-2 font-medium">Select Date</span>
          </div>
          
          <div className={`flex items-center ${currentStep === 'time' ? 'text-red-600' : selectedSlot ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'time' ? 'bg-red-600 text-white' : 
              selectedSlot ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Select Time</span>
          </div>
          
          <div className={`flex items-center ${currentStep === 'confirm' ? 'text-red-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'confirm' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
            <span className="ml-2 font-medium">Confirm</span>
          </div>
        </div>
      </div>

      {/* Step 1: Date Selection */}
      {currentStep === 'date' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Date</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {provider.availableDates.map((date) => (
              <button
                key={date}
                onClick={() => handleDateSelect(date)}
                className="p-4 border border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition text-center"
              >
                <div className="text-sm font-medium text-gray-800">
                  {formatDateShort(date)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(date).getDate()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Time Selection */}
      {currentStep === 'time' && selectedDate && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Time - {formatDate(selectedDate)}
            </h2>
            <button
              onClick={() => {
                setCurrentStep('date')
                setSelectedSlot(null)
              }}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Change Date
            </button>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {generateTimeSlots(selectedDate, provider.id).map((slot, index) => (
              <button
                key={index}
                onClick={() => slot.available && handleSlotSelect(slot)}
                disabled={!slot.available}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  slot.available
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 'confirm' && selectedDate && selectedSlot && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">{provider.name}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{provider.type}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">{provider.location}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedSlot.time}</span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">{user.name}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setCurrentStep('time')
                    setSelectedSlot(null)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Back
                </button>
              </div>
            </div>
          </div>

          {/* Service Selection & Confirmation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Complete Booking</h2>
            
            <form onSubmit={handleBooking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Service *
                </label>
                <div className="space-y-2">
                  {provider.services.map((service, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="service"
                        value={service}
                        checked={selectedService === service}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-3 text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Your Information</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone}</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-blue-500">ℹ️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Booking Information
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>• Please arrive 15 minutes before your appointment</p>
                      <p>• Bring a valid ID and insurance card if applicable</p>
                      <p>• You can cancel or reschedule up to 24 hours in advance</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition font-medium text-lg"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Booking
