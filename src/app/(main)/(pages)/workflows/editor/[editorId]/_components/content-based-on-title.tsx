import { AccordionContent } from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { onContentChange } from '@/lib/editor-utils'
import { ConnectionProviderProps } from '@/providers/connections-provider'
import { EditorState } from '@/providers/editor-provider'
import React, { useEffect } from 'react'
import GoogleFileDetails from './google-files-details'
import { nodeMapper } from '@/lib/types'
import GoogleDriveFiles from './google-drive-files'
import ActionButton from './action-button'
import { getFileMetaData } from '@/app/(main)/(pages)/connections/_actions/google-connections'
import { toast } from 'sonner'
import axios from 'axios'

export interface Option {
  value: string
  label: string
  disable?: boolean
  /** fixed option that can't be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined
}

type Props = {
  nodeConnection: ConnectionProviderProps
  newState: EditorState
  file: any
  setFile: (file: any) => void
  selectedSlackChannels: Option[]
  setSelectedSlackChannels: (value: Option[]) => void
}



const ContentBasedOnTitle = ({
  nodeConnection,
  newState,
  file,
  setFile,
  selectedSlackChannels,
  setSelectedSlackChannels,
}: Props) => {
  const { selectedNode } = newState.editor
  const title = selectedNode.data.title

  useEffect(() => {
    const reqGoogle = async () => {
      const response: { data: { message: { files: any } } } = await axios.get(
        '/api/drive'
      )
      if (response) {
        console.log(response.data.message.files[0])
        toast.message("Fetched File")
        setFile(response.data.message.files[0])
      } else {
        toast.error('Something went wrong')
      }
    }
    reqGoogle()
  }, [])

  // @ts-ignore
  const nodeConnectionType: any = nodeConnection[nodeMapper[title]]
  if (!nodeConnectionType) return <p>Not connected</p>

  const isConnected =
    title === 'Google Drive'
      ? !nodeConnection.isLoading
      : title === 'AI'
      ? true
      : !!nodeConnectionType[
      `${title === 'Slack'
        ? 'slackAccessToken'
        : title === 'Discord'
          ? 'webhookURL'
          : title === 'Notion'
            ? 'accessToken'
            : ''
      }`
      ]

  if (!isConnected) return <p>Not connected</p>

  const contentValue = nodeConnectionType.content || ''
  const isTypingVariable = contentValue.endsWith('{{')
  
  const getSuggestions = () => {
    if (title === 'AI') return ['Drive.fileContent', 'Drive.fileName', 'Drive.mimeType']
    if (title === 'Slack' || title === 'Discord' || title === 'Notion') return ['AI.response', 'Drive.fileContent']
    return []
  }

  const onSuggestionClick = (suggestion: string) => {
    const syntheticEvent = {
      target: { value: contentValue + suggestion + '}} ' }
    } as React.ChangeEvent<HTMLInputElement>
    onContentChange(nodeConnection, title, syntheticEvent)
  }

  return (
    <AccordionContent>
      <Card>
        {title === 'Discord' && (
          <CardHeader>
            <CardTitle>{nodeConnectionType.webhookName}</CardTitle>
            <CardDescription>{nodeConnectionType.guildName}</CardDescription>
          </CardHeader>
        )}
        <div className="flex flex-col gap-3 px-6 py-3 pb-20">
          <p>{title === 'Notion' ? 'Values to be stored' : title === 'AI' ? 'Prompt' : 'Message'}</p>

          <div className="relative">
            <Input
              type="text"
              value={nodeConnectionType.content}
              onChange={(event) => onContentChange(nodeConnection, title, event)}
            />
            {isTypingVariable && getSuggestions().length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#1C1C1E] border dark:border-neutral-800 rounded-md shadow-lg z-50 flex flex-col overflow-hidden">
                <div className="px-3 py-2 text-xs text-neutral-500 font-semibold bg-gray-50 dark:bg-neutral-900 border-b dark:border-neutral-800">
                  Select a variable
                </div>
                {getSuggestions().map((suggestion) => (
                  <div
                    key={suggestion}
                    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer text-sm font-mono transition-colors"
                    onClick={() => onSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {JSON.stringify(file) !== '{}' && title !== 'Google Drive' && (
            <Card className="w-full">
              <CardContent className="px-2 py-3">
                <div className="flex flex-col gap-4">
                  <CardDescription>Drive File</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <GoogleFileDetails
                      nodeConnection={nodeConnection}
                      title={title}
                      gFile={file}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {title === 'Google Drive' && <GoogleDriveFiles />}
          <ActionButton
            currentService={title}
            nodeConnection={nodeConnection}
            channels={selectedSlackChannels}
            setChannels={setSelectedSlackChannels}
          />
        </div>
      </Card>
    </AccordionContent>
  )
}

export default ContentBasedOnTitle