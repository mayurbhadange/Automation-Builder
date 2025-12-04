'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { Client } from '@notionhq/client'
import { ensureUserExists } from '@/lib/sync-user'
import { encrypt, decrypt } from '@/lib/encryption'

export const onNotionConnect = async (
  access_token: string,
  workspace_id: string,
  workspace_icon: string,
  workspace_name: string,
  database_id: string,
  id: string
) => {
  'use server'
  if (access_token) {
    console.log('🔥 Notion Connect started', { access_token, id })
    await ensureUserExists()

    // Check if notion is connected for THIS user
    const notion_connected = await db.notion.findFirst({
      where: {
        userId: id,
        workspaceId: workspace_id,
      },
      include: {
        connections: {
          select: {
            type: true,
          },
        },
      },
    })

    console.log('🔥 Notion connected check:', notion_connected)

    if (notion_connected) {
      // Update existing connection
      await db.notion.update({
        where: {
          id: notion_connected.id,
        },
        data: {
          accessToken: encrypt(access_token),
          workspaceIcon: workspace_icon!,
          workspaceName: workspace_name!,
          databaseId: database_id,
        },
      })
      console.log('✅ Notion connection updated successfully')
    } else {
      // Create new connection
      await db.notion.create({
        data: {
          userId: id,
          workspaceIcon: workspace_icon!,
          accessToken: encrypt(access_token),
          workspaceId: workspace_id!,
          workspaceName: workspace_name!,
          databaseId: database_id,
          connections: {
            create: {
              userId: id,
              type: 'Notion',
            },
          },
        },
      })
      console.log('✅ Notion connection created successfully')
    }
  }
}

export const getNotionConnection = async () => {
  const user = await currentUser()
  if (user) {
    const connection = await db.notion.findFirst({
      where: {
        userId: user.id,
      },
    })
    if (connection) {
      return connection
    }
  }
}

export const getNotionDatabase = async (
  databaseId: string,
  accessToken: string
) => {
  const notion = new Client({
    auth: decrypt(accessToken),
  })
  const response = await notion.databases.retrieve({ database_id: databaseId })
  return response
}

export const onCreateNewPageInDatabase = async (
  databaseId: string,
  accessToken: string,
  content: string
) => {
  const notion = new Client({
    auth: decrypt(accessToken),
  })

  console.log(databaseId)
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: databaseId,
    },
    properties: {
      name: [
        {
          text: {
            content: content,
          },
        },
      ],
    },
  })
  if (response) {
    return response
  }
}