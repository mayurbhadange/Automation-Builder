'use client'

import { ConnectionTypes } from '@/lib/types'
import React from 'react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  onRemoveDiscordConnection,
  onRemoveNotionConnection,
  onRemoveSlackConnection,
} from '../_actions/remove-connection'

type Props = {
  type: ConnectionTypes
  icon: string
  title: ConnectionTypes
  description: string
  callback?: () => void
  connected: {} & any
}

const ConnectionCard = ({
  description,
  type,
  icon,
  title,
  connected,
}: Props) => {
  const router = useRouter()

  const onRemoveConnection = async () => {
    try {
      if (title === 'Discord') {
        await onRemoveDiscordConnection()
        toast.success('Discord disconnected')
      }
      if (title === 'Notion') {
        await onRemoveNotionConnection()
        toast.success('Notion disconnected')
      }
      if (title === 'Slack') {
        await onRemoveSlackConnection()
        toast.success('Slack disconnected')
      }
      router.refresh()
    } catch (error) {
      console.log(error)
      toast.error('Failed to disconnect')
    }
  }

  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-row gap-2">
          <Image
            src={icon}
            alt={title}
            height={30}
            width={30}
            className="object-contain"
          />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connected[type] ? (
          <div className="flex flex-col gap-2">
            <div className="border-bg-primary rounded-lg border-2 px-3 py-2 font-bold text-white">
              Connected
            </div>
            {type !== 'Google Drive' && (
              <Button
                onClick={onRemoveConnection}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            )}
          </div>
        ) : (
          <Link
            href={
              title == 'Discord'
                ? process.env.NEXT_PUBLIC_DISCORD_REDIRECT!
                : title == 'Notion'
                  ? process.env.NEXT_PUBLIC_NOTION_AUTH_URL!
                  : title == 'Slack'
                    ? process.env.NEXT_PUBLIC_SLACK_REDIRECT!
                    : '#'
            }
            className=" rounded-lg bg-primary p-2 font-bold text-primary-foreground"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  )
}

export default ConnectionCard