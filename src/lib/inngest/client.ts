import { Inngest, eventType, staticSchema } from "inngest";

type DriveActivityNotification = {
  channelResourceId: string;
};

export const driveActivityEvent = eventType("drive.activity.notification", {
  schema: staticSchema<DriveActivityNotification>(),
});

export const inngest = new Inngest({ id: "fuzzie-app" });
