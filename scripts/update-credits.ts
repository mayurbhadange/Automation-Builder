
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
    const userId = 'user_36HFNN6MYhYXvWUwUktO5ugF5eq' // Found in logs
    console.log(`Updating credits for user: ${userId}`)

    const user = await db.user.update({
        where: {
            clerkId: userId,
        },
        data: {
            credits: 'Unlimited',
        },
    })

    console.log('✅ User credits updated to:', user.credits)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
