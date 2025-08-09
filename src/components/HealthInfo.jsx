import React from 'react'

const HealthInfo = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Health Checkup Information</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Explore comprehensive details about our Free Health Checkup program, eligibility, participating clinics, and how to book.
      </p>
      <div className="card-base p-6 space-y-3">
        <p className="text-gray-700 dark:text-gray-200">• Full body screening basics</p>
        <p className="text-gray-700 dark:text-gray-200">• What to expect during your visit</p>
        <p className="text-gray-700 dark:text-gray-200">• How to prepare</p>
        <p className="text-gray-700 dark:text-gray-200">• Follow-up and reports</p>
      </div>
    </div>
  )
}

export default HealthInfo


