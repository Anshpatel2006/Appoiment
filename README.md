# 🏥 QuickBooker - Multi-Role Appointment Booking System

A comprehensive appointment booking system built for the Indian healthcare market, featuring role-based dashboards for customers, providers, and administrators.

## 🌟 Features

### **Multi-Role System**
- **Customer Dashboard**: Browse and book appointments with healthcare providers
- **Provider Dashboard**: Manage schedules, view bookings, and track analytics
- **Admin Dashboard**: Complete system management with user, provider, and service oversight

### **Indian Localization**
- 🇮🇳 Indian cities (Delhi, Mumbai, Bangalore, Chennai, Pune, etc.)
- ₹ Indian Rupee currency formatting
- 📱 Indian phone number formats
- 🏥 Local healthcare provider names and brands

### **Customer Features**
- 🔍 Browse providers by location, type, and services
- 📅 Real-time appointment booking with date/time selection
- 💰 Price comparison and filtering
- 📋 View and manage personal bookings
- ⭐ Provider ratings and reviews
- 🗑️ Cancel appointments

### **Provider Features**
- 📊 Comprehensive dashboard with analytics
- 📅 Interactive time slot management (block/unblock slots)
- 👥 View today's schedule and all bookings
- 💰 Revenue tracking and statistics
- 📈 Popular services analytics
- ✅ Appointment confirmation and cancellation
- 🕐 Real-time booking notifications

### **Admin Features**
- 👥 Complete user management (customers, providers, admins)
- 🏥 Provider management (add, edit, delete)
- 🛠️ Service management per provider type
- 📊 System-wide analytics and statistics
- 💰 Revenue overview across all providers
- 📋 All bookings management

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd Appoiment_System
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser and navigate to the provided URL (usually `http://localhost:5173`)**

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Login Credentials

### Test Accounts

#### **Customer Account**
- **Email:** `customer@test.com`
- **Password:** `password`
- **Access:** Browse and book appointments

#### **Admin Account**
- **Email:** `admin@test.com`
- **Password:** `password`
- **Access:** Full system management

#### **Provider Accounts**
All providers have individual accounts with password `password`:

| Provider | Email | Dashboard Access |
|----------|-------|------------------|
| Apollo Hospital | `provider@test.com` | Provider Dashboard |
| Fortis Healthcare | `fortishealthcare@provider.com` | Provider Dashboard |
| Lakshmi Beauty Salon | `lakshmisalon@provider.com` | Provider Dashboard |
| VLCC Wellness Center | `vlccwellness@provider.com` | Provider Dashboard |
| Clove Dental Care | `clovedental@provider.com` | Provider Dashboard |
| Jawed Habib Hair Studio | `jawedhabib@provider.com` | Provider Dashboard |
| Max Healthcare | `maxhealthcare@provider.com` | Provider Dashboard |
| Kaya Skin Clinic | `kayaskin@provider.com` | Provider Dashboard |

## 🏗️ Project Structure

```
Appoiment_System/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx    # Admin management interface
│   │   ├── ProviderDashboard.jsx # Provider management interface
│   │   ├── Booking.jsx           # Appointment booking form
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Authentication
│   │   ├── MyBookings.jsx        # User's booking history
│   │   ├── Navbar.jsx            # Navigation component
│   │   └── Providers.jsx         # Provider listing and search
│   ├── context/
│   │   └── AppContext.jsx        # Global state management
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind CSS imports
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

## 🛠️ Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **State Management:** React Context API
- **Icons:** Unicode Emojis
- **Development:** ESLint, PostCSS

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- 💻 Desktop computers
- 📱 Mobile phones
- 📱 Tablets
- 🖥️ Large screens

## 🎯 Key Functionalities

### **Authentication & Authorization**
- Role-based login system
- Secure password authentication
- Persistent login sessions
- Role-based route protection

### **Booking Management**
- Real-time availability checking
- Date and time slot selection
- Service-specific booking
- Booking confirmation and cancellation
- Email notifications (UI ready)

### **Provider Management**
- Interactive time slot blocking/unblocking
- Revenue analytics and reporting
- Customer management
- Service popularity tracking
- Schedule optimization

### **Admin Controls**
- User role management
- Provider onboarding and management
- Service catalog management
- System-wide analytics
- Revenue tracking

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with modern React and Vite for optimal performance
- Tailwind CSS for beautiful, responsive design
- Indian healthcare market research for localization
- Community feedback for user experience improvements
