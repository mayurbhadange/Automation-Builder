// import React from 'react'

// const DashboardPage = () => {
//   return (
//     <div className="flex flex-col gap-4 relative">
//       <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
//         Dashboard
//       </h1>
//     </div>
//   )
// }

// export default DashboardPage

import React from 'react'

const stats = [
  { label: 'Active Workflows', value: 3 },
  { label: 'Credits Left', value: 6 },
  { label: 'Integrations', value: 5 },
  { label: 'Plan', value: 'Free' },
]

const recentActivities = [
  { time: '2 min ago', action: 'Workflow "Daily Report" executed' },
  { time: '10 min ago', action: 'Slack integration connected' },
  { time: '1 hr ago', action: 'Workflow "Send Invoice" created' },
  { time: 'Yesterday', action: 'Activated Free Plan' },
]

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1e24] min-h-screen">
      <h1 className="text-4xl font-bold sticky top-0 z-[10] p-6 bg-background/60 backdrop-blur-lg flex items-center border-b border-neutral-800 shadow-lg">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-neutral-900/80 p-6 flex flex-col items-center shadow-md border border-neutral-800 hover:scale-[1.03] transition-transform"
          >
            <span className="text-3xl font-semibold text-blue-400">{stat.value}</span>
            <span className="text-neutral-300 mt-2">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-200">Recent Activity</h2>
        <div className="bg-neutral-900/80 rounded-xl p-6 border border-neutral-800 shadow">
          <ul className="divide-y divide-neutral-800">
            {recentActivities.map((activity, idx) => (
              <li key={idx} className="py-3 flex items-center justify-between">
                <span className="text-neutral-300">{activity.action}</span>
                <span className="text-xs text-neutral-500">{activity.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage