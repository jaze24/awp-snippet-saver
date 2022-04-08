import { json } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  try {
    const db = await connectDb();
    const { endpoint } = await request.json();
    await db.models.Subscription.findOneAndDelete({ endpoint: endpoint });
    return json({ ok: true }, { status: 200 });
  } catch (error) {
    return json({ error }, { status: 400 });
  }
}
