import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useRevealOnScroll from '../hooks/useRevealOnScroll'
import { useApp } from '../context/AppContext'

const Home = () => {
  useRevealOnScroll()
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
    <div className="app-surface no-top-gap">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20 relative overflow-hidden dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(600px 200px at 0% 0%, #fff, transparent 60%), radial-gradient(600px 200px at 100% 100%, #fff, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Book Your Healthcare Appointments in India
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
            Find and book appointments with top-rated hospitals, clinics, salons, and wellness centers. 
            Easy booking, instant confirmation, and seamless healthcare management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-light text-lg"
            >
              Book Appointment Now
            </button>
            <button
              onClick={() => document.getElementById('providers').scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-light-outline text-lg"
            >
              Browse Providers
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Why Choose QuickBooker?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              We make healthcare booking simple, fast, and reliable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 reveal-card card-base dark:bg-gray-800">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Verified Providers</h3>
              <p className="text-gray-600 dark:text-gray-300">All healthcare providers are verified and rated by real patients</p>
            </div>
            
            <div className="text-center p-6 reveal-card card-base dark:bg-gray-800">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Instant Booking</h3>
              <p className="text-gray-600 dark:text-gray-300">Book appointments instantly with real-time availability</p>
            </div>
            
            <div className="text-center p-6 reveal-card card-base dark:bg-gray-800">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Easy Management</h3>
              <p className="text-gray-600 dark:text-gray-300">Manage all your appointments from one convenient dashboard</p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section id="providers" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Featured Healthcare Providers</h2>
            <p className="section-subtitle">Discover top-rated hospitals, clinics, and wellness centers</p>
          </div>

          {/* Filters */}
          <div className="card-base p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search providers or services..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                />
              </div>
              
              <div>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
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
                 className="card-base dark:bg-gray-800 overflow-hidden hover:shadow-lg transition cursor-pointer transform hover:scale-105 reveal-card"
                 onClick={() => handleProviderClick(provider)}
               >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{provider.image}</span>
              <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{provider.type} • {provider.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-500">
                        {formatPrice(provider.price)}
                      </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                        {provider.priceRange}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-500">⭐</span>
                     <span className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                      {provider.rating}/5
                    </span>
                     <span className="text-gray-400 dark:text-gray-500 mx-2">•</span>
                     <span className="text-sm text-gray-600 dark:text-gray-300">
                      {provider.availableDates.length} days available
                    </span>
                  </div>
                  
                  <div className="mb-4">
                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.slice(0, 3).map((service, index) => (
                        <span
                          key={index}
                           className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                      {provider.services.length > 3 && (
                         <span className="text-xs text-gray-500 dark:text-gray-400">
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
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Health & Wellness</h2>
            <p className="section-subtitle">Discover the latest in healthcare and wellness</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 reveal-card fancy-card">
              <span className="shine" />
              <div className="relative z-10 fancy-float">
              <h3 className="text-xl font-bold mb-2">Free Health Checkup</h3>
              <p className="mb-4">Get a comprehensive health checkup at participating clinics</p>
              <button
                onClick={() => navigate('/health-info')}
                className="bg-white text-blue-600 px-4 py-2 rounded font-semibold dark:text-blue-700"
              >
                More Information
              </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 reveal-card fancy-card">
              <span className="shine" />
              <div className="relative z-10 fancy-float">
              <h3 className="text-xl font-bold mb-2">Wellness Programs</h3>
              <p className="mb-4">Join our wellness programs for a healthier lifestyle</p>
              <button className="bg-white text-green-600 px-4 py-2 rounded font-semibold dark:text-green-700">
                Join Now
              </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 reveal-card fancy-card">
              <span className="shine" />
              <div className="relative z-10 fancy-float">
              <h3 className="text-xl font-bold mb-2">Mental Health Support</h3>
              <p className="mb-4">Access professional mental health services and counseling</p>
              <button
                onClick={() => navigate('/mental-health')}
                className="bg-white text-purple-600 px-4 py-2 rounded font-semibold dark:text-purple-700"
              >
                More Information
              </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title text-white mb-4">Ready to Book Your Appointment?</h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">Join thousands of satisfied patients who trust QuickBooker</p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-light text-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
