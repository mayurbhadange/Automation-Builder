'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export const getDashboardStats = async () => {
    const user = await currentUser()

    if (!user) return { totalWorkflows: 0, activeWorkflows: 0, credits: '0', tier: 'Free', connections: [] }

    const totalWorkflows = await db.workflows.count({
        where: {
            userId: user.id,
        },
    })

    const activeWorkflows = await db.workflows.count({
        where: {
            userId: user.id,
            publish: true,
        },
    })

    const userData = await db.user.findUnique({
        where: {
            clerkId: user.id,
        },
        select: {
            credits: true,
            tier: true,
            connections: true,
        },
    })

    return {
        totalWorkflows,
        activeWorkflows,
        credits: userData?.credits || '0',
        tier: userData?.tier || 'Free',
        connections: userData?.connections || [],
    }
}
