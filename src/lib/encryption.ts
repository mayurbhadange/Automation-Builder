
import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const SALT_LENGTH = 64
const TAG_LENGTH = 16

const getKey = (secret: string) => {
    return crypto.scryptSync(secret, 'salt', 32)
}

export const encrypt = (text: string) => {
    const secret = process.env.ENCRYPTION_KEY
    if (!secret) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables')
    }

    const iv = crypto.randomBytes(IV_LENGTH)
    const key = getKey(secret)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const tag = cipher.getAuthTag()

    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`
}

export const decrypt = (text: string) => {
    const secret = process.env.ENCRYPTION_KEY
    if (!secret) {
        throw new Error('ENCRYPTION_KEY is not defined in environment variables')
    }

    const parts = text.split(':')
    if (parts.length !== 3) {
        // If it's not in the format iv:tag:encrypted, assume it's legacy plain text
        // and return it as is (or handle migration)
        return text
    }

    const [ivHex, tagHex, encryptedHex] = parts

    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    const key = getKey(secret)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(tag)

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}
