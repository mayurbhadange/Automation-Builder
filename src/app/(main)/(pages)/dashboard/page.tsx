import React from 'react'

const stats = [
  { label: 'Users', value: '1,234' },
  { label: 'Revenue', value: '$12,345' },
  { label: 'Activity', value: '87%' },
]

const recentActivity = [
  'User John Doe signed up',
  'Payment received from Jane Smith',
  'Server backup completed',
  'New comment on post #42',
]

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-8 relative p-6">
      <h1 className="text-4xl sticky top-0 z-[10] bg-background/50 backdrop-blur-lg flex items-center border-b pb-4 mb-6">
        Dashboard
      </h1>
      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center border"
          >
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-gray-500 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {recentActivity.map((item, idx) => (
              <li key={idx} className="text-gray-700 dark:text-gray-300">
                • {item}
              </li>
            ))}
          </ul>
        </div>
        {/* Chart Placeholder */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col items-center justify-center border min-h-[200px]">
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400">
            [Chart Placeholder]
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage