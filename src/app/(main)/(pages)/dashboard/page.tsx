import React from 'react'
import { getDashboardStats } from './_actions/dashboard-connections'
import CreditTracker from '../billing/_components/credits-tracker'
import { CONNECTIONS } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

const DashboardPage = async () => {
  const { totalWorkflows, activeWorkflows, credits, tier, connections } = await getDashboardStats()

  return (
    <div className="flex flex-col relative w-full">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        Dashboard
      </h1>
      <div className="relative flex flex-col gap-4 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-neutral-900/80 p-6 flex flex-col items-center shadow-md border border-neutral-800 hover:scale-[1.03] transition-transform">
            <span className="text-3xl font-semibold text-blue-400">{totalWorkflows}</span>
            <span className="text-neutral-300 mt-2">Total Workflows</span>
          </div>
          <div className="rounded-xl bg-neutral-900/80 p-6 flex flex-col items-center shadow-md border border-neutral-800 hover:scale-[1.03] transition-transform">
            <span className="text-3xl font-semibold text-blue-400">{activeWorkflows}</span>
            <span className="text-neutral-300 mt-2">Active Workflows</span>
          </div>
        </div>
        <div className="w-full">
          <CreditTracker credits={parseInt(credits)} tier={tier} />
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-neutral-200">Connected Apps</h2>
            <Link href="/connections" className="text-sm text-neutral-400 hover:text-neutral-200 hover:underline">
              (connect more apps)
            </Link>
          </div>
          <div className="flex gap-4 flex-wrap">
            {CONNECTIONS.map((conn) => {
              const isConnected = connections.find((c) => c.type === conn.title)
              if (isConnected) {
                return (
                  <div key={conn.title} className="flex items-center gap-2 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800">
                    <Image
                      src={conn.image}
                      alt={conn.title}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                )
              }
              return null
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <h2 className="text-2xl font-bold text-neutral-200">Contact Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="mailto:mayurbhadange2004@gmail.com"
              className="flex items-center gap-4 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              <div className="p-2 bg-blue-500/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">Email</span>
                <span className="text-neutral-200 font-medium">mayurbhadange2004@gmail.com</span>
              </div>
            </a>
            <a
              href="https://github.com/mayurbhadange"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              <div className="p-2 bg-neutral-500/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-200"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">GitHub</span>
                <span className="text-neutral-200 font-medium">mayurbhadange</span>
              </div>
            </a>
            <a
              href="https://x.com/mayurbhadange10"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-neutral-900/80 p-4 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              <div className="p-2 bg-neutral-500/10 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-200"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-neutral-400">X (Twitter)</span>
                <span className="text-neutral-200 font-medium">@mayurbhadange10</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage