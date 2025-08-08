import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Home = () => {
  const { allProviders, formatPrice } = useApp()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    search: ''
  })

  // Get unique values for filter options
  const uniqueTypes = [...new Set(allProviders.map(p => p.type))]
  const uniqueLocations = [...new Set(allProviders.map(p => p.location))]

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  // Filter providers based on selected filters
  const filteredProviders = allProviders.filter(provider => {
    const matchesType = !filters.type || provider.type === filters.type
    const matchesLocation = !filters.location || provider.location === filters.location
    const matchesSearch = !filters.search || 
      provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      provider.services.some(service => 
        service.toLowerCase().includes(filters.search.toLowerCase())
      )

    return matchesType && matchesLocation && matchesSearch
  })

  const handleProviderClick = (provider) => {
    // Redirect to login if not authenticated, otherwise go to booking
    navigate('/login', { state: { redirectTo: `/booking/${provider.id}` } })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Book Your Healthcare Appointments in India
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Find and book appointments with top-rated hospitals, clinics, salons, and wellness centers. 
            Easy booking, instant confirmation, and seamless healthcare management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Book Appointment Now
            </button>
            <button
              onClick={() => document.getElementById('providers').scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition"
            >
              Browse Providers
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose BookMyAppointment?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make healthcare booking simple, fast, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Verified Providers</h3>
              <p className="text-gray-600">All healthcare providers are verified and rated by real patients</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book appointments instantly with real-time availability</p>
            </div>
            
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Management</h3>
              <p className="text-gray-600">Manage all your appointments from one convenient dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section id="providers" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Healthcare Providers</h2>
            <p className="text-gray-600">Discover top-rated hospitals, clinics, and wellness centers</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search providers or services..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Types</option>
                  {uniqueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer transform hover:scale-105"
                onClick={() => handleProviderClick(provider)}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{provider.image}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-600">{provider.type} • {provider.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(provider.price)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {provider.priceRange}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {provider.rating}/5
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-sm text-gray-600">
                      {provider.availableDates.length} days available
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 3).map((service, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{provider.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition">
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Health & Wellness</h2>
            <p className="text-gray-600">Discover the latest in healthcare and wellness</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Free Health Checkup</h3>
              <p className="mb-4">Get a comprehensive health checkup at participating clinics</p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded font-semibold">
                Learn More
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Wellness Programs</h3>
              <p className="mb-4">Join our wellness programs for a healthier lifestyle</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded font-semibold">
                Join Now
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Mental Health Support</h3>
              <p className="mb-4">Access professional mental health services and counseling</p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded font-semibold">
                Get Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Appointment?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied patients who trust BookMyAppointment</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
