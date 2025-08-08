import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])

  // Sample data for hospitals and salons with Indian cities
  const providers = [
    {
      id: 1,
      name: "Apollo Hospital",
      type: "Hospital",
      location: "Delhi",
      rating: 4.5,
      image: "🏥",
      services: ["General Consultation", "Cardiology", "Orthopedics", "Dermatology"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12"],
      priceRange: "₹₹",
      price: 800
    },
    {
      id: 2,
      name: "Fortis Healthcare",
      type: "Clinic",
      location: "Mumbai",
      rating: 4.3,
      image: "🏥",
      services: ["Family Medicine", "Pediatrics", "Women's Health"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11"],
      priceRange: "₹",
      price: 500
    },
    {
      id: 3,
      name: "Lakme Beauty Salon",
      type: "Salon",
      location: "Bangalore",
      rating: 4.7,
      image: "💇‍♀️",
      services: ["Hair Cut", "Hair Color", "Facial", "Manicure", "Pedicure"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12", "2025-08-13"],
      priceRange: "₹₹",
      price: 1200
    },
    {
      id: 4,
      name: "VLCC Wellness Center",
      type: "Spa",
      location: "Chennai",
      rating: 4.8,
      image: "🧖‍♀️",
      services: ["Full Body Massage", "Aromatherapy", "Body Scrub", "Reflexology"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11"],
      priceRange: "₹₹₹",
      price: 2500
    },
    {
      id: 5,
      name: "Clove Dental Care",
      type: "Dental",
      location: "Pune",
      rating: 4.4,
      image: "🦷",
      services: ["Dental Checkup", "Teeth Cleaning", "Root Canal", "Orthodontics"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12"],
      priceRange: "₹₹",
      price: 1000
    },
    {
      id: 6,
      name: "Jawed Habib Hair Studio",
      type: "Salon",
      location: "Kolkata",
      rating: 4.6,
      image: "💇‍♀️",
      services: ["Hair Styling", "Hair Treatment", "Bridal Makeup", "Hair Extensions"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11"],
      priceRange: "₹₹₹",
      price: 3000
    },
    {
      id: 7,
      name: "Max Healthcare",
      type: "Clinic",
      location: "Hyderabad",
      rating: 4.2,
      image: "🏥",
      services: ["General Medicine", "Vaccination", "Health Checkup"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12"],
      priceRange: "₹",
      price: 400
    },
    {
      id: 8,
      name: "Kaya Skin Clinic",
      type: "Spa",
      location: "Ahmedabad",
      rating: 4.5,
      image: "🧖‍♀️",
      services: ["Skin Treatment", "Laser Therapy", "Facial Treatment"],
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11"],
      priceRange: "₹₹",
      price: 1800
    }
  ]

  // Utility function to format Indian currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  // Indian cities for location filters
  const indianCities = [
    'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Pune', 'Kolkata', 
    'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'
  ]

  // Available services for different provider types
  const availableServices = {
    Hospital: ['General Consultation', 'Emergency Care', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'Pediatrics'],
    Clinic: ['Family Medicine', 'General Checkup', 'Vaccination', 'Women\'s Health', 'Pediatrics', 'Minor Surgery'],
    Salon: ['Hair Cut', 'Hair Color', 'Hair Styling', 'Facial', 'Manicure', 'Pedicure', 'Hair Treatment', 'Bridal Makeup'],
    Spa: ['Full Body Massage', 'Aromatherapy', 'Body Scrub', 'Reflexology', 'Hot Stone Therapy', 'Facial Treatment'],
    Dental: ['Dental Checkup', 'Teeth Cleaning', 'Root Canal', 'Orthodontics', 'Tooth Extraction', 'Dental Implants']
  }

  // State for managing users and services
  const [usersState, setUsersState] = useState([
    {
      id: 1,
      email: 'customer@test.com',
      password: 'password',
      name: 'Rahul Sharma',
      phone: '+91-98765-43210',
      role: 'customer'
    },
    {
      id: 2,
      email: 'provider@test.com',
      password: 'password',
      name: 'Dr. Priya Patel',
      phone: '+91-87654-32109',
      role: 'provider',
      providerId: 1 // Links to Apollo Hospital
    },
    {
      id: 3,
      email: 'admin@test.com',
      password: 'password',
      name: 'Amit Kumar',
      phone: '+91-76543-21098',
      role: 'admin'
    },
    // Provider accounts for all remaining providers
    {
      id: 4,
      email: 'fortishealthcare@provider.com',
      password: 'password',
      name: 'Dr. Suresh Gupta',
      phone: '+91-98765-43211',
      role: 'provider',
      providerId: 2 // Links to Fortis Healthcare
    },
    {
      id: 5,
      email: 'lakshmisalon@provider.com',
      password: 'password',
      name: 'Ms. Lakshmi Devi',
      phone: '+91-98765-43212',
      role: 'provider',
      providerId: 3 // Links to Lakshmi Beauty Salon
    },
    {
      id: 6,
      email: 'vlccwellness@provider.com',
      password: 'password',
      name: 'Ms. Kavya Reddy',
      phone: '+91-98765-43213',
      role: 'provider',
      providerId: 4 // Links to VLCC Wellness Center
    },
    {
      id: 7,
      email: 'clovedental@provider.com',
      password: 'password',
      name: 'Dr. Rajesh Khanna',
      phone: '+91-98765-43214',
      role: 'provider',
      providerId: 5 // Links to Clove Dental Care
    },
    {
      id: 8,
      email: 'jawedhabib@provider.com',
      password: 'password',
      name: 'Mr. Jawed Habib',
      phone: '+91-98765-43215',
      role: 'provider',
      providerId: 6 // Links to Jawed Habib Hair Studio
    },
    {
      id: 9,
      email: 'maxhealthcare@provider.com',
      password: 'password',
      name: 'Dr. Anita Sharma',
      phone: '+91-98765-43216',
      role: 'provider',
      providerId: 7 // Links to Max Healthcare
    },
    {
      id: 10,
      email: 'kayaskin@provider.com',
      password: 'password',
      name: 'Dr. Meera Agarwal',
      phone: '+91-98765-43217',
      role: 'provider',
      providerId: 8 // Links to Kaya Skin Clinic
    }
  ])

  const [servicesState, setServicesState] = useState(availableServices)

  const login = (email, password) => {
    // Simple authentication - in real app, this would be API call
    const foundUser = usersState.find(u => u.email === email && u.password === password)
    if (foundUser) {
      const { password: _, ...userData } = foundUser // Remove password from stored data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  // Service management functions
  const addService = (providerType, serviceName) => {
    setServicesState(prev => ({
      ...prev,
      [providerType]: [...(prev[providerType] || []), serviceName]
    }))
  }

  const removeService = (providerType, serviceName) => {
    setServicesState(prev => ({
      ...prev,
      [providerType]: prev[providerType].filter(s => s !== serviceName)
    }))
  }

  // User management functions
  const addUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData
    }
    setUsersState(prev => [...prev, newUser])
    return newUser
  }

  const updateUser = (userId, updates) => {
    setUsersState(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    )
  }

  const deleteUser = (userId) => {
    setUsersState(prev => prev.filter(user => user.id !== userId))
  }

  // Create provider user automatically when adding a provider
  const createProviderUser = (providerData) => {
    const email = `${providerData.name.toLowerCase().replace(/\s+/g, '')}@provider.com`
    const providerUser = {
      email,
      password: 'password',
      name: `Dr. ${providerData.name}`,
      phone: '+91-' + Math.floor(Math.random() * 9000000000 + 1000000000),
      role: 'provider',
      providerId: providerData.id
    }
    return addUser(providerUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      userId: user.id,
      status: 'Confirmed'
    }
    setBookings(prev => [...prev, newBooking])
    return newBooking
  }

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId))
  }

  // Generate time slots for a given date and provider
  const generateTimeSlots = (date, providerId) => {
    const slots = []
    const startHour = 9
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const isBooked = bookings.some(booking => 
          booking.providerId === providerId && 
          booking.date === date && 
          booking.time === time
        )
        slots.push({
          time,
          available: !isBooked && Math.random() > 0.3 // Randomly make some slots unavailable
        })
      }
    }
    return slots
  }

  // Provider management functions (for admin)
  const [providersState, setProvidersState] = useState(providers)

  const addProvider = (providerData) => {
    const newProvider = {
      id: Date.now(),
      ...providerData,
      availableDates: ["2025-08-09", "2025-08-10", "2025-08-11", "2025-08-12"]
    }
    setProvidersState(prev => [...prev, newProvider])
    
    // Automatically create a provider user account
    createProviderUser(newProvider)
    
    return newProvider
  }

  const updateProvider = (providerId, updates) => {
    setProvidersState(prev => 
      prev.map(provider => 
        provider.id === providerId ? { ...provider, ...updates } : provider
      )
    )
  }

  const deleteProvider = (providerId) => {
    setProvidersState(prev => prev.filter(provider => provider.id !== providerId))
    // Also remove related bookings
    setBookings(prev => prev.filter(booking => booking.providerId !== providerId))
    // Also remove related provider user
    setUsersState(prev => prev.filter(user => user.providerId !== providerId))
  }

  // Get bookings based on user role
  const getUserBookings = () => {
    if (!user) return []
    
    switch (user.role) {
      case 'customer':
        return bookings.filter(booking => booking.userId === user.id)
      case 'provider':
        return bookings.filter(booking => booking.providerId === user.providerId)
      case 'admin':
        return bookings
      default:
        return []
    }
  }

  // Get providers based on user role
  const getUserProviders = () => {
    if (!user) return []
    
    switch (user.role) {
      case 'customer':
        return providersState
      case 'provider':
        return providersState.filter(provider => provider.id === user.providerId)
      case 'admin':
        return providersState
      default:
        return []
    }
  }

  const value = {
    user,
    providers: getUserProviders(),
    allProviders: providersState,
    bookings: getUserBookings(),
    allBookings: bookings,
    allUsers: usersState,
    availableServices: servicesState,
    formatPrice,
    indianCities,
    login,
    logout,
    addBooking,
    cancelBooking,
    generateTimeSlots,
    addProvider,
    updateProvider,
    deleteProvider,
    addService,
    removeService,
    addUser,
    updateUser,
    deleteUser,
    createProviderUser
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}
