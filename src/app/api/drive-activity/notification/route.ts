// import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
// import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
// import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";
// import { db } from "@/lib/db";
// import axios from "axios";
// import { headers } from "next/headers";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//     console.log('🔴 Changed')
//     const headersList = headers()
//     let channelResourceId
//     headersList.forEach((value, key) => {
//         if (key == 'x-goog-resource-id') {
//             channelResourceId = value
//         }
//     })

//     //WIP:CREDITS
//     if (channelResourceId) {
//         const user = await db.user.findFirst({
//             where: {
//                 googleResourceId: channelResourceId,
//             },
//             select: { clerkId: true, credits: true },
//         })
//         if ((user && parseInt(user.credits!) > 0) || user?.credits == 'Unlimited') {
//             const workflow = await db.workflows.findMany({
//                 where: {
//                     userId: user.clerkId,
//                 }
//             })
//             if (workflow) {
//                 workflow.map(async (flow) => {
//                     // Add safety checks for flowPath
//                     if (!flow.flowPath) {
//                         console.log(`⚠️ Workflow ${flow.id} has no flowPath defined`)
//                         return
//                     }

//                     let flowPath
//                     try {
//                         flowPath = JSON.parse(flow.flowPath)
//                     } catch (error) {
//                         console.log(`❌ Invalid JSON in flowPath for workflow ${flow.id}:`, error)
//                         return
//                     }

//                     if (!flowPath || !Array.isArray(flowPath)) {
//                         console.log(`⚠️ Workflow ${flow.id} has invalid flowPath:`, flowPath)
//                         return
//                     }
//                     let current = 0
//                     while (current < flowPath.length) {
//                         if (flowPath[current] == 'Discord') {
//                             const discordMessage = await db.discordWebhook.findFirst({
//                                 where: {
//                                     userId: flow.userId,
//                                 },
//                                 select: {
//                                     url: true,
//                                 },
//                             })
//                             if (discordMessage) {
//                                 await postContentToWebHook(
//                                     flow.discordTemplate!,
//                                     discordMessage.url
//                                 )
//                                 flowPath.splice(flowPath[current], 1)
//                             }
//                         }

//                         if (flowPath[current] == 'Slack') {
//                             const channels = flow.slackChannels.map((channel) => {
//                                 return {
//                                     label: '',
//                                     value: channel,
//                                 }
//                             })
//                             await postMessageToSlack(
//                                 flow.slackAccessToken!,
//                                 channels,
//                                 flow.slackTemplate!
//                             )
//                             flowPath.splice(flowPath[current], 1)
//                         }

//                         if (flowPath[current] == 'Notion') {
//                             await onCreateNewPageInDatabase(
//                                 flow.notionDbId!,
//                                 flow.notionAccessToken!,
//                                 JSON.parse(flow.notionTemplate!)
//                             )
//                             flowPath.splice(flowPath[current], 1)
//                         }


//                         if (flowPath[current] == 'Wait') {
//                             const res = await axios.put(
//                                 'https://api.cron-job.org/jobs',
//                                 {
//                                     job: {
//                                         url: `${process.env.NGROK_URI}?flow_id=${flow.id}`,
//                                         enabled: 'true',
//                                         schedule: {
//                                             timezone: 'Europe/Istanbul',
//                                             expiresAt: 0,
//                                             hours: [-1],
//                                             mdays: [-1],
//                                             minutes: ['*****'],
//                                             months: [-1],
//                                             wdays: [-1],
//                                         },
//                                     },
//                                 },
//                                 {
//                                     headers: {
//                                         Authorization: `Bearer ${process.env.CRON_JOB_KEY!}`,
//                                         'Content-Type': 'application/json',
//                                     },
//                                 }
//                             )
//                             if (res) {
//                                 flowPath.splice(flowPath[current], 1)
//                                 const cronPath = await db.workflows.update({
//                                     where: {
//                                         id: flow.id,
//                                     },
//                                     data: {
//                                         cronPath: JSON.stringify(flowPath),
//                                     },
//                                 })
//                                 if (cronPath) break
//                             }
//                             break
//                         }
//                         current++
//                     }
//                     // Only update credits if not unlimited
//                      if (user.credits !== 'Unlimited') {
//                          await db.user.update({
//                              where: {
//                                  clerkId: user.clerkId,
//                              },
//                              data: {
//                                  credits: `${parseInt(user.credits!) - 1}`,
//                              },
//                          })
//                      }
//                 })
//                 return Response.json(
//                     {
//                         message: 'flow completed',
//                     },
//                     {
//                         status: 200,
//                     }
//                 )
//             }
//         }
//     }
//     return Response.json(
//         {
//             message: 'success',
//         },
//         {
//             status: 200,
//         }
//     )
// }


//cursor's  code

import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";
import { db } from "@/lib/db";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log('🔴 Changed')
    const headersList = headers()
    let channelResourceId
    headersList.forEach((value, key) => {
        if (key == 'x-goog-resource-id') {
            channelResourceId = value
        }
    })

    //WIP:CREDITS
    console.log(`🔄 Channel Resource ID: ${channelResourceId}`)
    
    if (channelResourceId) {
        const user = await db.user.findFirst({
            where: {
                googleResourceId: channelResourceId,
            },
            select: { clerkId: true, credits: true },
        })
        
        console.log(`🔄 User found: ${user ? user.clerkId : 'None'}`)
        
        if (!user) {
            console.log(`❌ No user found for googleResourceId: ${channelResourceId}`)
            return Response.json({ message: 'User not found' }, { status: 404 })
        }
        
        console.log(`🔄 User credits: ${user.credits}`)
        
        if ((user && parseInt(user.credits!) > 0) || user?.credits == 'Unlimited') {
            console.log(`✅ User has sufficient credits, proceeding with workflow execution`)
            const workflow = await db.workflows.findMany({
                where: {
                    userId: user.clerkId,
                    publish: true, // Only execute published workflows
                }
            })
            if (workflow && workflow.length > 0) {
                console.log(`🔄 Found ${workflow.length} published workflows to execute`)
                workflow.map(async (flow) => {
                    console.log(`🔄 Processing workflow: ${flow.name}`)
                    
                    if (!flow.flowPath) {
                        console.log(`❌ Workflow ${flow.name} has no flowPath`)
                        return
                    }
                    
                    const flowPath = JSON.parse(flow.flowPath!)
                    console.log(`🔄 FlowPath: ${JSON.stringify(flowPath)}`)
                    
                    if (flowPath.length === 0) {
                        console.log(`❌ Workflow ${flow.name} has empty flowPath`)
                        return
                    }
                    
                    let current = 0
                    while (current < flowPath.length) {
                        if (flowPath[current] == 'Discord') {
                            const discordMessage = await db.discordWebhook.findFirst({
                                where: {
                                    userId: flow.userId,
                                },
                                select: {
                                    url: true,
                                },
                            })
                            if (discordMessage) {
                                await postContentToWebHook(
                                    flow.discordTemplate!,
                                    discordMessage.url
                                )
                                flowPath.splice(flowPath[current], 1)
                            }
                        }

                        if (flowPath[current] == 'Slack') {
                            console.log(`🔄 Executing Slack action for workflow: ${flow.name}`)
                            
                            if (!flow.slackChannels || flow.slackChannels.length === 0) {
                                console.log(`❌ No Slack channels configured for workflow: ${flow.name}`)
                                current++
                                continue
                            }
                            
                            if (!flow.slackAccessToken) {
                                console.log(`❌ No Slack access token for workflow: ${flow.name}`)
                                current++
                                continue
                            }
                            
                            if (!flow.slackTemplate) {
                                console.log(`❌ No Slack template for workflow: ${flow.name}`)
                                current++
                                continue
                            }
                            
                            const channels = flow.slackChannels.map((channel) => {
                                return {
                                    label: '',
                                    value: channel,
                                }
                            })
                            
                            console.log(`🔄 Sending to Slack channels: ${JSON.stringify(channels)}`)
                            console.log(`🔄 Message template: ${flow.slackTemplate}`)
                            
                            try {
                                await postMessageToSlack(
                                    flow.slackAccessToken!,
                                    channels,
                                    flow.slackTemplate!
                                )
                                console.log(`✅ Slack message sent successfully`)
                            } catch (error) {
                                console.log(`❌ Error sending Slack message: ${error}`)
                            }
                            
                            flowPath.splice(flowPath[current], 1)
                        }

                        if (flowPath[current] == 'Notion') {
                            await onCreateNewPageInDatabase(
                                flow.notionDbId!,
                                flow.notionAccessToken!,
                                JSON.parse(flow.notionTemplate!)
                            )
                            flowPath.splice(flowPath[current], 1)
                        }

                         
                        if (flowPath[current] == 'Wait') {
                            const res = await axios.put(
                                'https://api.cron-job.org/jobs',
                                {
                                    job: {
                                        url: `${process.env.NGROK_URI}?flow_id=${flow.id}`,
                                        enabled: 'true',
                                        schedule: {
                                            timezone: 'Europe/Istanbul',
                                            expiresAt: 0,
                                            hours: [-1],
                                            mdays: [-1],
                                            minutes: ['*****'],
                                            months: [-1],
                                            wdays: [-1],
                                        },
                                    },
                                },
                                {
                                    headers: {
                                        Authorization: `Bearer ${process.env.CRON_JOB_KEY!}`,
                                        'Content-Type': 'application/json',
                                    },
                                }
                            )
                            if (res) {
                                flowPath.splice(flowPath[current], 1)
                                const cronPath = await db.workflows.update({
                                    where: {
                                        id: flow.id,
                                    },
                                    data: {
                                        cronPath: JSON.stringify(flowPath),
                                    },
                                })
                                if (cronPath) break
                            }
                            break
                        }
                        current++
                    }
                    await db.user.update({
                        where: {
                            clerkId: user.clerkId,
                        },
                        data: {
                            credits: `${parseInt(user.credits!) - 1}`,
                        },
                    })
                })
                return Response.json(
                    {
                        message: 'flow completed',
                    },
                    {
                        status: 200,
                    }
                )
            }
        }
    }
    return Response.json(
        {
            message: 'success',
        },
        {
            status: 200,
        }
    )
}

