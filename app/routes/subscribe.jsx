import { json } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  try {
    const db = await connectDb();
    const payload = await request.json();
    await db.models.Subscription.create(payload);
    return json({ ok: true }, { status: 201 });
  } catch (error) {
    return json({ error }, { status: 400 });
  }
}
