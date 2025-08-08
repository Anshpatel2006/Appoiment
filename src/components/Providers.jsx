import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const Providers = () => {
  const { providers, formatPrice, indianCities } = useApp()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    rating: '',
    priceRange: '',
    search: ''
  })

  // Get unique values for filter options
  const uniqueTypes = [...new Set(providers.map(p => p.type))]
  const uniqueLocations = [...new Set(providers.map(p => p.location))]
  const priceRanges = ['₹', '₹₹', '₹₹₹']

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      type: '',
      location: '',
      rating: '',
      priceRange: '',
      search: ''
    })
  }

  // Filter providers based on selected filters
  const filteredProviders = providers.filter(provider => {
    const matchesType = !filters.type || provider.type === filters.type
    const matchesLocation = !filters.location || provider.location === filters.location
    const matchesRating = !filters.rating || provider.rating >= parseFloat(filters.rating)
    const matchesPriceRange = !filters.priceRange || provider.priceRange === filters.priceRange
    const matchesSearch = !filters.search || 
      provider.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      provider.services.some(service => 
        service.toLowerCase().includes(filters.search.toLowerCase())
      )

    return matchesType && matchesLocation && matchesRating && matchesPriceRange && matchesSearch
  })

  const handleProviderSelect = (provider) => {
    navigate(`/booking/${provider.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Choose Healthcare Provider
        </h1>
        <p className="text-gray-600">
          Find and book appointments with top-rated healthcare providers
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search providers or services..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Rating
            </label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            >
              <option value="">Any Price</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>
                  {range} {range === '₹' ? '(Budget)' : range === '₹₹' ? '(Moderate)' : '(Premium)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {Object.values(filters).some(filter => filter) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Search: "{filters.search}"
                  <button
                    onClick={() => handleFilterChange('search', '')}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.type && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.type}
                  <button
                    onClick={() => handleFilterChange('type', '')}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.location}
                  <button
                    onClick={() => handleFilterChange('location', '')}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.rating}+ Stars
                  <button
                    onClick={() => handleFilterChange('rating', '')}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.priceRange && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {filters.priceRange}
                  <button
                    onClick={() => handleFilterChange('priceRange', '')}
                    className="ml-1 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProviders.length} of {providers.length} providers
        </p>
      </div>

      {/* Providers Grid */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No providers found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
          <button
            onClick={clearFilters}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer transform hover:scale-105"
              onClick={() => handleProviderSelect(provider)}
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
      )}
    </div>
  )
}

export default Providers
