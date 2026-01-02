
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
    const userId = 'user_2yB5oJhNIQvPz9Yw2aIgylFB4E9'
    console.log(`Updating credits for user: ${userId}`)

    const user = await db.user.update({
        where: {
            clerkId: userId,
        },
        data: {
            credits: '100',
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
