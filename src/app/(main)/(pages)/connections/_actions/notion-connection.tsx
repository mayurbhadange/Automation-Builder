'use server'

import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs'
import { Client } from '@notionhq/client'
import { ensureUserExists } from '@/lib/sync-user'

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
        accessToken: access_token,
        userId: id, // Scoped to current user
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

    if (!notion_connected) {
      //create connection
      await db.notion.create({
        data: {
          userId: id,
          workspaceIcon: workspace_icon!,
          accessToken: access_token,
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
    auth: accessToken,
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
    auth: accessToken,
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