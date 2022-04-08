import webpush from "web-push";
import connectDb from "~/db/connectDb.server.js";

webpush.setVapidDetails(
  "mailto:dob@eaaa.dk",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function notifyAll(payload) {
  const db = await connectDb();
  const subscriptions = await db.models.Subscription.find();
  console.log("Notifying subscriptions", subscriptions.length);
  for (const subscription of subscriptions) {
    try {
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: subscription.keys,
        },
        JSON.stringify(payload)
      );
    } catch (error) {
      console.log("Web Push error", error);
    }
  }
}
