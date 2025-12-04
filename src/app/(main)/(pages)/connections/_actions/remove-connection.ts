'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'

export const onRemoveNotionConnection = async () => {
    const user = await currentUser()
    if (!user) return

    await db.notion.deleteMany({
        where: {
            userId: user.id,
        },
    })
    await db.connections.deleteMany({
        where: {
            userId: user.id,
            type: 'Notion',
        },
    })
    revalidatePath('/connections')
}

export const onRemoveSlackConnection = async () => {
    const user = await currentUser()
    if (!user) return

    await db.slack.deleteMany({
        where: {
            userId: user.id,
        },
    })
    await db.connections.deleteMany({
        where: {
            userId: user.id,
            type: 'Slack',
        },
    })
    revalidatePath('/connections')
}

export const onRemoveDiscordConnection = async () => {
    const user = await currentUser()
    if (!user) return

    await db.discordWebhook.deleteMany({
        where: {
            userId: user.id,
        },
    })
    await db.connections.deleteMany({
        where: {
            userId: user.id,
            type: 'Discord',
        },
    })
    revalidatePath('/connections')
}
