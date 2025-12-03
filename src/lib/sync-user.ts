import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'

export const ensureUserExists = async () => {
    const user = await currentUser()
    if (!user) return null

    const existingUser = await db.user.findUnique({
        where: { clerkId: user.id },
    })

    if (existingUser) return existingUser

    const userByEmail = await db.user.findUnique({
        where: { email: user.emailAddresses[0].emailAddress },
    })

    if (userByEmail) {
        return await db.user.update({
            where: { id: userByEmail.id },
            data: {
                clerkId: user.id,
                profileImage: user.imageUrl,
                name: user.firstName,
            },
        })
    }

    const newUser = await db.user.create({
        data: {
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName,
            profileImage: user.imageUrl,
        },
    })

    return newUser
}
