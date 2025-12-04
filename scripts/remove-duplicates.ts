import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
    console.log('🧹 Starting cleanup of duplicate connections...')

    // Cleanup Notion
    const notionConnections = await db.notion.findMany()
    const notionByUser = notionConnections.reduce((acc, curr) => {
        if (!acc[curr.userId]) acc[curr.userId] = []
        acc[curr.userId].push(curr)
        return acc
    }, {} as Record<string, typeof notionConnections>)

    for (const [userId, connections] of Object.entries(notionByUser)) {
        if (connections.length > 1) {
            console.log(`Found ${connections.length} Notion connections for user ${userId}. Removing all to ensure clean state.`)
            await db.notion.deleteMany({ where: { userId } })
            await db.connections.deleteMany({ where: { userId, type: 'Notion' } })
        }
    }

    // Cleanup Slack
    const slackConnections = await db.slack.findMany()
    const slackByUser = slackConnections.reduce((acc, curr) => {
        if (!acc[curr.userId]) acc[curr.userId] = []
        acc[curr.userId].push(curr)
        return acc
    }, {} as Record<string, typeof slackConnections>)

    for (const [userId, connections] of Object.entries(slackByUser)) {
        if (connections.length > 1) {
            console.log(`Found ${connections.length} Slack connections for user ${userId}. Removing all to ensure clean state.`)
            await db.slack.deleteMany({ where: { userId } })
            await db.connections.deleteMany({ where: { userId, type: 'Slack' } })
        }
    }

    // Cleanup Discord
    const discordConnections = await db.discordWebhook.findMany()
    const discordByUser = discordConnections.reduce((acc, curr) => {
        if (!acc[curr.userId]) acc[curr.userId] = []
        acc[curr.userId].push(curr)
        return acc
    }, {} as Record<string, typeof discordConnections>)

    for (const [userId, connections] of Object.entries(discordByUser)) {
        if (connections.length > 1) {
            console.log(`Found ${connections.length} Discord connections for user ${userId}. Removing all to ensure clean state.`)
            await db.discordWebhook.deleteMany({ where: { userId } })
            await db.connections.deleteMany({ where: { userId, type: 'Discord' } })
        }
    }

    console.log('✨ Cleanup complete!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
