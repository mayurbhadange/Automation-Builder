import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { inngest, driveActivityEvent } from "@/lib/inngest/client";

export async function POST(req: NextRequest) {
    console.log('🔵 Webhook received: Google Drive Activity Notification');
    
    // Google Drive sends the channel resource ID in headers
    const headersList = headers()
    let channelResourceId
    headersList.forEach((value, key) => {
        if (key == 'x-goog-resource-id') {
            channelResourceId = value
        }
    })

    console.log(`🔄 Channel Resource ID: ${channelResourceId}`);

    if (channelResourceId) {
        // Delegate all the heavy lifting to the Inngest background queue
        await inngest.send(
            driveActivityEvent.create({
                channelResourceId,
            })
        );
        console.log(`✅ Offloaded workflow execution to Inngest queue for ${channelResourceId}`);
    }

    // Always immediately return 200 OK so Google Drive webhook doesn't timeout!
    return Response.json(
        { message: 'success' },
        { status: 200 }
    )
}