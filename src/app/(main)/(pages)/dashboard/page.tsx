import React, { useEffect, useState } from 'react'

const integrationsCount = 5 // Static for now

type Stat = { label: string; value: string | number }
type Activity = { time: string; action: string }

const recentActivities: Activity[] = [
  { time: '2 min ago', action: 'Workflow "Daily Report" executed' },
  { time: '10 min ago', action: 'Slack integration connected' },
  { time: '1 hr ago', action: 'Upgraded to Pro Plan' },
  { time: 'Yesterday', action: 'Workflow "Send Invoice" created' },
]

const DashboardPage = () => {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Active Workflows', value: '-' },
    { label: 'Credits Left', value: '-' },
    { label: 'Integrations', value: integrationsCount },
    { label: 'Plan', value: '-' },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const res = await fetch('/api/dashboard')
        if (res.ok) {
          const data = await res.json()
          setStats([
            { label: 'Active Workflows', value: data.activeWorkflows },
            { label: 'Credits Left', value: data.creditsLeft },
            { label: 'Integrations', value: integrationsCount },
            { label: 'Plan', value: data.plan },
          ])
        }
      } catch (e) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-[#18181b] via-[#23232a] to-[#1e1e24] min-h-screen">
      <h1 className="text-4xl font-bold sticky top-0 z-[10] p-6 bg-background/60 backdrop-blur-lg flex items-center border-b border-neutral-800 shadow-lg">
        Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {stats.map((stat: Stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-neutral-900/80 p-6 flex flex-col items-center shadow-md border border-neutral-800 hover:scale-[1.03] transition-transform"
          >
            <span className="text-3xl font-semibold text-blue-400">{loading ? '...' : stat.value}</span>
            <span className="text-neutral-300 mt-2">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-neutral-200">Recent Activity</h2>
        <div className="bg-neutral-900/80 rounded-xl p-6 border border-neutral-800 shadow">
          <ul className="divide-y divide-neutral-800">
            {recentActivities.map((activity: Activity, idx: number) => (
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