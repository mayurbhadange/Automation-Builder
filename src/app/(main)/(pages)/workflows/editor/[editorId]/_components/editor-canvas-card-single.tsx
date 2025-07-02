import { EditorCanvasCardType } from '@/lib/types'
import { useEditor } from '@/providers/editor-provider'
import React, { useMemo } from 'react'
import { Position, useNodeId } from 'reactflow'
import EditorCanvasIconHelper from './editor-canvas-icon-helper'
import CustomHandle from './custom-handle'
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import clsx from 'clsx'

type Props = {}

const EditorCanvasCardSingle = ({data}: {data: EditorCanvasCardType}) => {
    const {dispatch, state} = useEditor()
    const nodeId = useNodeId()
    const logo = useMemo(() => {
        return <EditorCanvasIconHelper type={data.type}/>
    }, [data])
  return (
    <>
        {data.type !== 'Trigger' && data.type !== 'Google Drive' && (
            <CustomHandle 
                type="target"
                position={Position.Top}
                style={{zIndex: 100}}
            />
            
        )}
        <Card
        onClick={(e) => {
          e.stopPropagation()
          const val = state.editor.elements.find((n) => n.id === nodeId)
          if (val)
            dispatch({
              type: 'SELECTED_ELEMENT',
              payload: {
                element: val,
              },
            })
        }}
        className="relative max-w-[400px] dark:border-muted-foreground/70"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div>{logo}</div>
          <div>
            <CardTitle className="text-md">{data.title}</CardTitle>
            <CardDescription>
              <p className="text-xs text-muted-foreground/50">
                <b className="text-muted-foreground/80">ID: </b>
                {nodeId}
              </p>
              <p>{data.description}</p>
            </CardDescription>
          </div>
        </CardHeader>
        <Badge
          variant="secondary"
          className="absolute right-2 top-2"
        >
          {data.type}
        </Badge>
        <div
          className={clsx('absolute left-3 top-4 h-2 w-2 rounded-full', {
            'bg-green-500': Math.random() < 0.6,
            'bg-orange-500': Math.random() >= 0.6 && Math.random() < 0.8,
            'bg-red-500': Math.random() >= 0.8,
          })}
        ></div>
      </Card>
      <CustomHandle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{zIndex: 100}}
      />
    </>
  )
}

export default EditorCanvasCardSingle






// import React from 'react'
// import { Handle, Position } from 'reactflow'

// interface EditorCanvasCardSingleProps {
//   data: {
//     title: string
//     description: string
//     completed: boolean
//     current: boolean
//     metadata: any
//     type: string
//   }
//   selected?: boolean
// }

// const EditorCanvasCardSingle = ({ data, selected }: EditorCanvasCardSingleProps) => {
//   return (
//     <div className={`relative bg-background border-2 rounded-lg p-4 min-w-[200px] shadow-md ${
//       selected ? 'border-primary' : 'border-border'
//     }`}>
//       {/* Input Handle - Top */}
//       {data.type !== 'Trigger' && (
//         <Handle
//           type="target"
//           position={Position.Top}
//           className="w-3 h-3 !bg-primary border-2 border-background"
//         />
//       )}
      
//       {/* Card Content */}
//       <div className="flex items-center gap-3">
//         <div className="flex-1">
//           <h3 className="font-semibold text-sm">{data.title}</h3>
//           <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
//         </div>
        
//         {/* Status indicators */}
//         <div className="flex flex-col gap-1">
//           {data.completed && (
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//           )}
//           {data.current && (
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//           )}
//         </div>
//       </div>
      
//       {/* Output Handle - Bottom */}
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         className="w-3 h-3 !bg-primary border-2 border-background"
//       />
//     </div>
//   )
// }

// export default EditorCanvasCardSingle