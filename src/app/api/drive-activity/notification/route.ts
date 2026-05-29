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

// import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
// import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
// import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";
// import { db } from "@/lib/db";
// import axios from "axios";
// import { headers } from "next/headers";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//     console.log('🔵 Webhook received: Google Drive Activity Notification');
//     const headersList = headers()
//     let channelResourceId
//     headersList.forEach((value, key) => {
//         if (key == 'x-goog-resource-id') {
//             channelResourceId = value
//         }
//     })

//     console.log(`🔄 Channel Resource ID: ${channelResourceId}`);
//     //WIP:CREDITS

//     if (channelResourceId) {
//         const user = await db.user.findFirst({
//             where: {
//                 googleResourceId: channelResourceId,
//             },
//             select: { clerkId: true, credits: true },
//         })

//         console.log(`🔄 User found: ${user ? user.clerkId : 'None'}`)

//         if (!user) {
//             console.log(`❌ No user found for googleResourceId: ${channelResourceId}`)
//             return Response.json({ message: 'User not found' }, { status: 404 })
//         }

//         console.log(`🔄 User credits: ${user.credits}`)

//         if ((user && parseInt(user.credits!) > 0) || user?.credits == 'Unlimited') {
//             console.log(`✅ User has sufficient credits, proceeding with workflow execution`)
//             const workflow = await db.workflows.findMany({
//                 where: {
//                     userId: user.clerkId,
//                     publish: true, // Only execute published workflows
//                 }
//             })
//             if (workflow && workflow.length > 0) {
//                 console.log(`🔄 Found ${workflow.length} published workflows to execute`)
//                 workflow.map(async (flow) => {
//                     console.log(`🔄 Processing workflow: ${flow.name}`)

//                     if (!flow.flowPath) {
//                         console.log(`❌ Workflow ${flow.name} has no flowPath`)
//                         return
//                     }

//                     const flowPath = JSON.parse(flow.flowPath!)
//                     console.log(`🔄 FlowPath: ${JSON.stringify(flowPath)}`)

//                     if (flowPath.length === 0) {
//                         console.log(`❌ Workflow ${flow.name} has empty flowPath`)
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
//                             console.log(`🔄 Executing Slack action for workflow: ${flow.name}`)

//                             if (!flow.slackChannels || flow.slackChannels.length === 0) {
//                                 console.log(`❌ No Slack channels configured for workflow: ${flow.name}`)
//                                 current++
//                                 continue
//                             }

//                             if (!flow.slackAccessToken) {
//                                 console.log(`❌ No Slack access token for workflow: ${flow.name}`)
//                                 current++
//                                 continue
//                             }

//                             if (!flow.slackTemplate) {
//                                 console.log(`❌ No Slack template for workflow: ${flow.name}`)
//                                 current++
//                                 continue
//                             }

//                             const channels = flow.slackChannels.map((channel) => {
//                                 return {
//                                     label: '',
//                                     value: channel,
//                                 }
//                             })

//                             console.log(`🔄 Sending to Slack channels: ${JSON.stringify(channels)}`)
//                             console.log(`🔄 Message template: ${flow.slackTemplate}`)

//                             try {
//                                 await postMessageToSlack(
//                                     flow.slackAccessToken!,
//                                     channels,
//                                     flow.slackTemplate!
//                                 )
//                                 console.log(`✅ Slack message sent successfully`)
//                             } catch (error) {
//                                 console.log(`❌ Error sending Slack message: ${error}`)
//                             }

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
//                                         url: `https://fuzzie-kohl.vercel/api/drive-activity/notification?flow_id=${flow.id}`,
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
//                     await db.user.update({
//                         where: {
//                             clerkId: user.clerkId,
//                         },
//                         data: {
//                             credits: `${parseInt(user.credits!) - 1}`,
//                         },
//                     })
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

// gemini's code

import { postContentToWebHook } from "@/app/(main)/(pages)/connections/_actions/discord-connection";
import { onCreateNewPageInDatabase } from "@/app/(main)/(pages)/connections/_actions/notion-connection";
import { postMessageToSlack } from "@/app/(main)/(pages)/connections/_actions/slack-connection";
import { db } from "@/lib/db";
import axios from "axios";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    console.log('🔵 Webhook received: Google Drive Activity Notification');
    const headersList = headers()
    let channelResourceId
    headersList.forEach((value, key) => {
        if (key == 'x-goog-resource-id') {
            channelResourceId = value
        }
    })

    console.log(`🔄 Channel Resource ID: ${channelResourceId}`);
    //WIP:CREDITS

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

                for (const flow of workflow) {
                    console.log(`🔄 Processing workflow: ${flow.name}`)

                    if (!flow.flowPath) {
                        console.log(`❌ Workflow ${flow.name} has no flowPath`)
                        continue // Use continue to move to the next workflow
                    }

                    const flowPath = JSON.parse(flow.flowPath!)
                    console.log(`🔄 FlowPath: ${JSON.stringify(flowPath)}`)

                    if (flowPath.length === 0) {
                        console.log(`❌ Workflow ${flow.name} has empty flowPath`)
                        continue
                    }

                    // STEP 4: Fetch latest Google Drive file and initialize Memory Context
                    let fileContent = ""
                    const hasAiNode = flowPath.includes('AI')
                    if (hasAiNode) {
                        try {
                            const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
                                user.clerkId,
                                'oauth_google'
                            )
                            const accessToken = clerkResponse[0].token
                            const oauth2Client = new google.auth.OAuth2()
                            oauth2Client.setCredentials({ access_token: accessToken })
                            const drive = google.drive({ version: 'v3', auth: oauth2Client })
                            
                            const driveResponse = await drive.files.list({
                                pageSize: 1,
                                orderBy: 'modifiedTime desc',
                            })
                            const latestFile = driveResponse.data.files?.[0]
                            
                            if (latestFile) {
                                if (latestFile.mimeType?.startsWith('image/')) {
                                    const fileContentRes = await drive.files.get({
                                        fileId: latestFile.id!,
                                        alt: 'media',
                                    }, { responseType: 'arraybuffer' })
                                    fileContent = Buffer.from(fileContentRes.data as any).toString('base64')
                                } else {
                                    const fileContentRes = await drive.files.get({
                                        fileId: latestFile.id!,
                                        alt: 'media',
                                    }, { responseType: 'text' })
                                    fileContent = typeof fileContentRes.data === 'string' 
                                        ? fileContentRes.data 
                                        : JSON.stringify(fileContentRes.data)
                                }
                            }
                        } catch (err) {
                            console.log("Error fetching file content", err)
                            fileContent = "[System Note: The uploaded file is an unsupported format and its contents cannot be read.]"
                        }
                    }

                    let workflowMemory = {
                        googleDrive: { fileContent },
                        aiResponse: ""
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
                                const finalMessage = flow.discordTemplate!.replace('{{AI.response}}', workflowMemory.aiResponse)
                                await postContentToWebHook(
                                    finalMessage,
                                    discordMessage.url
                                )
                                flowPath.splice(current, 1)
                                continue
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
                            
                            const finalSlackMessage = flow.slackTemplate!.replace('{{AI.response}}', workflowMemory.aiResponse)
                            console.log(`🔄 Message template: ${finalSlackMessage}`)

                            try {
                                await postMessageToSlack(
                                    flow.slackAccessToken!,
                                    channels,
                                    finalSlackMessage
                                )
                                console.log(`✅ Slack message sent successfully`)
                            } catch (error) {
                                console.log(`❌ Error sending Slack message: ${error}`)
                            }

                            // Fixed: The splice operation was incorrect, using current index is needed
                            flowPath.splice(current, 1)
                            continue
                        }

                        if (flowPath[current] == 'Notion') {
                            const finalNotionTemplate = flow.notionTemplate!.replace('{{AI.response}}', workflowMemory.aiResponse)
                            await onCreateNewPageInDatabase(
                                flow.notionDbId!,
                                flow.notionAccessToken!,
                                JSON.parse(finalNotionTemplate)
                            )
                            // Fixed: The splice operation was incorrect, using current index is needed
                            flowPath.splice(current, 1)
                            continue
                        }

                        if (flowPath[current] == 'Wait') {
                            const res = await axios.put(
                                'https://api.cron-job.org/jobs',
                                {
                                    job: {
                                        url: `https://fuzzie-kohl.vercel.app/api/drive-activity/notification?flow_id=${flow.id}`,
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
                                flowPath.splice(current, 1)
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

                        if (flowPath[current] == 'AI') {
                            console.log(`🔄 Executing AI action for workflow: ${flow.name}`)
                            try {
                                if (!flow.aiTemplate) {
                                    console.log(`❌ No AI template for workflow: ${flow.name}`)
                                    current++
                                    continue
                                }
                                
                                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
                                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

                                try {
                                    // Check if the memory has base64 image data (starts with /9j/ for JPEG, iVBORw0KGgo for PNG, etc)
                                    // A simple heuristic: if it doesn't have spaces and is long, it might be base64. 
                                    const isBase64 = /^[a-zA-Z0-9+/]+={0,2}$/.test(workflowMemory.googleDrive.fileContent.substring(0, 50)) 
                                                    && workflowMemory.googleDrive.fileContent.length > 100;

                                    if (isBase64) {
                                        const finalPrompt = flow.aiTemplate.replace('{{Drive.fileContent}}', '[Attached Image]')
                                        const result = await model.generateContent({
                                            contents: [
                                                {
                                                    role: 'user',
                                                    parts: [
                                                        { text: finalPrompt },
                                                        { inlineData: { data: workflowMemory.googleDrive.fileContent, mimeType: "image/jpeg" } }
                                                    ]
                                                }
                                            ]
                                        })
                                        workflowMemory.aiResponse = result.response.text()
                                    } else {
                                        const finalPrompt = flow.aiTemplate.replace('{{Drive.fileContent}}', workflowMemory.googleDrive.fileContent)
                                        const result = await model.generateContent(finalPrompt)
                                        workflowMemory.aiResponse = result.response.text()
                                    }
                                    console.log(`✅ AI successfully generated response`)
                                } catch (err: any) {
                                    console.log(`❌ AI Generation Error:`, err)
                                    workflowMemory.aiResponse = "[AI Error: Failed to generate response]"
                                }
                            } catch (error) {
                                console.log(`❌ General AI Error:`, error)
                                workflowMemory.aiResponse = "[AI Error: Unexpected failure]"
                            }
                            flowPath.splice(current, 1)
                            continue
                        }

                        current++
                    }
                }

                // Now that the loop is complete, we can update the user's credits
                try {
                    await db.user.update({
                        where: {
                            clerkId: user.clerkId,
                        },
                        data: {
                            credits: `${parseInt(user.credits!) - 1}`,
                        },
                    })
                } catch (error) {
                    console.error("Error updating credits:", error);
                }

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