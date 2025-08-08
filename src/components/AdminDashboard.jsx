import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const AdminDashboard = () => {
  const { 
    allProviders, 
    allBookings, 
    allUsers, 
    availableServices,
    formatPrice, 
    indianCities,
    addProvider, 
    updateProvider, 
    deleteProvider,
    addService,
    removeService,
    addUser,
    updateUser,
    deleteUser
  } = useApp()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddProvider, setShowAddProvider] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)
  const [showAddService, setShowAddService] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newService, setNewService] = useState({ type: 'Hospital', name: '' })
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'customer' })
  const [newProvider, setNewProvider] = useState({
    name: '',
    type: 'Hospital',
    location: '',
    rating: 4.0,
    image: '🏥',
    services: [],
    priceRange: '₹',
    price: 500
  })

  const providerTypes = ['Hospital', 'Clinic', 'Salon', 'Spa', 'Dental']
  const priceRanges = [
    { symbol: '₹', label: 'Budget', minPrice: 300, maxPrice: 600 },
    { symbol: '₹₹', label: 'Moderate', minPrice: 700, maxPrice: 1500 },
    { symbol: '₹₹₹', label: 'Premium', minPrice: 1600, maxPrice: 5000 }
  ]

  const handleAddProvider = (e) => {
    e.preventDefault()
    if (!newProvider.name || !newProvider.location || newProvider.services.length === 0) {
      alert('Please fill in all required fields')
      return
    }
    
    const providerData = {
      ...newProvider,
      services: newProvider.services.split(',').map(s => s.trim()).filter(s => s),
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12"]
    }
    
    addProvider(providerData)
    setNewProvider({
      name: '',
      type: 'Hospital',
      location: '',
      rating: 4.0,
      image: '🏥',
      services: [],
      priceRange: '₹',
      price: 500
    })
    setShowAddProvider(false)
  }

  const handleEditProvider = (provider) => {
    setEditingProvider(provider)
    setNewProvider({
      ...provider,
      services: provider.services.join(', ')
    })
    setShowAddProvider(true)
  }

  const handleUpdateProvider = (e) => {
    e.preventDefault()
    const updatedData = {
      ...newProvider,
      services: newProvider.services.split(',').map(s => s.trim()).filter(s => s)
    }
    
    updateProvider(editingProvider.id, updatedData)
    setEditingProvider(null)
    setNewProvider({
      name: '',
      type: 'Hospital',
      location: '',
      rating: 4.0,
      image: '🏥',
      services: [],
      priceRange: '₹',
      price: 500
    })
    setShowAddProvider(false)
  }

  const handleDeleteProvider = (providerId) => {
    if (window.confirm('Are you sure you want to delete this provider? This will also cancel all related bookings.')) {
      deleteProvider(providerId)
    }
  }

  const handleAddService = (e) => {
    e.preventDefault()
    if (!newService.name.trim()) {
      alert('Please enter a service name')
      return
    }
    
    addService(newService.type, newService.name.trim())
    setNewService({ type: 'Hospital', name: '' })
    setShowAddService(false)
  }

  const handleRemoveService = (providerType, serviceName) => {
    if (window.confirm(`Are you sure you want to remove "${serviceName}" from ${providerType} services?`)) {
      removeService(providerType, serviceName)
    }
  }

  const handleAddUser = (e) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields')
      return
    }
    
    const userData = {
      ...newUser,
      password: 'password', // Default password
      id: Date.now()
    }
    
    addUser(userData)
    setNewUser({ name: '', email: '', phone: '', role: 'customer' })
    setShowAddUser(false)
  }

  const getStats = () => {
    const totalRevenue = allBookings
      .filter(booking => booking.status === 'Confirmed')
      .reduce((sum, booking) => {
        const provider = allProviders.find(p => p.id === booking.providerId)
        return sum + (provider?.price || 0)
      }, 0)

    return {
      totalProviders: allProviders.length,
      totalBookings: allBookings.length,
      confirmedBookings: allBookings.filter(b => b.status === 'Confirmed').length,
      totalRevenue,
      totalUsers: allUsers.length
    }
  }

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Manage providers, bookings, and system overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Welcome, Admin</span>
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-medium">
            A
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'providers', label: 'Providers', icon: '🏥' },
              { id: 'services', label: 'Services', icon: '🔧' },
              { id: 'bookings', label: 'Bookings', icon: '📅' },
              { id: 'users', label: 'Users', icon: '👥' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl text-blue-600 mr-4">🏥</div>
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Providers</p>
                      <p className="text-2xl font-bold text-blue-800">{stats.totalProviders}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl text-green-600 mr-4">📅</div>
                    <div>
                      <p className="text-sm font-medium text-green-600">Total Bookings</p>
                      <p className="text-2xl font-bold text-green-800">{stats.totalBookings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl text-yellow-600 mr-4">✅</div>
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Confirmed</p>
                      <p className="text-2xl font-bold text-yellow-800">{stats.confirmedBookings}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-3xl text-purple-600 mr-4">💰</div>
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-purple-800">{formatPrice(stats.totalRevenue)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                <div className="space-y-3">
                  {allBookings.slice(0, 5).map((booking, index) => {
                    const provider = allProviders.find(p => p.id === booking.providerId)
                    return (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{provider?.image || '🏥'}</span>
                          <div>
                            <p className="font-medium text-gray-800">{provider?.name || 'Unknown Provider'}</p>
                            <p className="text-sm text-gray-600">{booking.service} • {booking.date} at {booking.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{formatPrice(provider?.price || 0)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Manage Providers</h3>
                <button
                  onClick={() => setShowAddProvider(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Add New Provider
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProviders.map(provider => (
                  <div key={provider.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-3">{provider.image}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                        <p className="text-sm text-gray-600">{provider.type} • {provider.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatPrice(provider.price)}</p>
                        <p className="text-xs text-gray-500">{provider.priceRange}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600 ml-1">{provider.rating}/5</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.slice(0, 2).map((service, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {service}
                          </span>
                        ))}
                        {provider.services.length > 2 && (
                          <span className="text-xs text-gray-500">+{provider.services.length - 2} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditProvider(provider)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProvider(provider.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Manage Services</h3>
                <button
                  onClick={() => setShowAddService(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Add New Service
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(availableServices).map(([providerType, services]) => (
                  <div key={providerType} className="bg-white border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-800">{providerType} Services</h4>
                      <span className="text-sm text-gray-500">{services.length} services</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-800">{service}</span>
                          <button
                            onClick={() => handleRemoveService(providerType, service)}
                            className="text-red-600 hover:text-red-800 text-sm"
                            title="Remove service"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {services.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No services available for {providerType}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">All Bookings</h3>
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allBookings.map((booking, index) => {
                        const provider = allProviders.find(p => p.id === booking.providerId)
                        return (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">{provider?.image || '🏥'}</span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {provider?.name || 'Unknown Provider'}
                                  </div>
                                  <div className="text-sm text-gray-500">{provider?.location}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.service}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.date}<br />
                              <span className="text-gray-500">{booking.time}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(provider?.price || 0)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">System Users</h3>
                <button
                  onClick={() => setShowAddUser(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Add New User
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allUsers.map(user => (
                  <div key={user.id} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                        user.role === 'admin' ? 'bg-red-600' :
                        user.role === 'provider' ? 'bg-blue-600' :
                        'bg-green-600'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-800">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Role:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'provider' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Phone:</span>
                        <span className="text-sm text-gray-800">{user.phone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Provider Modal */}
      {showAddProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingProvider ? 'Edit Provider' : 'Add New Provider'}
              </h3>
              <button
                onClick={() => {
                  setShowAddProvider(false)
                  setEditingProvider(null)
                  setNewProvider({
                    name: '',
                    type: 'Hospital',
                    location: '',
                    rating: 4.0,
                    image: '🏥',
                    services: [],
                    priceRange: '₹',
                    price: 500
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingProvider ? handleUpdateProvider : handleAddProvider} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider({...newProvider, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={newProvider.type}
                  onChange={(e) => setNewProvider({...newProvider, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {providerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <select
                  value={newProvider.location}
                  onChange={(e) => setNewProvider({...newProvider, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select City</option>
                  {indianCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newProvider.rating}
                  onChange={(e) => setNewProvider({...newProvider, rating: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <select
                  value={newProvider.priceRange}
                  onChange={(e) => {
                    const range = priceRanges.find(r => r.symbol === e.target.value)
                    setNewProvider({
                      ...newProvider, 
                      priceRange: e.target.value,
                      price: range ? range.minPrice : 500
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {priceRanges.map(range => (
                    <option key={range.symbol} value={range.symbol}>
                      {range.symbol} ({range.label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={newProvider.price}
                  onChange={(e) => setNewProvider({...newProvider, price: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Services * (comma-separated)</label>
                <textarea
                  value={newProvider.services}
                  onChange={(e) => setNewProvider({...newProvider, services: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="e.g., General Consultation, Cardiology, X-Ray"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  {editingProvider ? 'Update Provider' : 'Add Provider'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddProvider(false)
                    setEditingProvider(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New Service</h3>
              <button
                onClick={() => setShowAddService(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider Type *</label>
                <select
                  value={newService.type}
                  onChange={(e) => setNewService({...newService, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {Object.keys(availableServices).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddService(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Add New User</h3>
              <button
                onClick={() => setShowAddUser(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+91-XXXXX-XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="customer">Customer</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-xs text-blue-600">
                  Default password will be set to "password". User can change it later.
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
