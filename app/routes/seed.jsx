import { Form, json, Link, redirect, useLoaderData } from "remix";
import connectDb from "~/db/connectDb.server";
import seedData from "~/db/seed.json";

export async function loader() {
  const db = await connectDb();
  const snippetsCount = await db.models.Snippet.countDocuments();
  return json({
    snippetsCount,
    defaultSnippetsCount: seedData.snippets.length,
  });
}

export async function action({ request }) {
  const db = await connectDb();
  const formData = await request.formData();
  if (formData.get("_action") === "seed") {
    await db.models.Snippet.deleteMany({});
    await db.models.Snippet.insertMany(seedData.snippets);
    return redirect("/snippets");
  }
}

export default function Seed() {
  const { snippetsCount, defaultSnippetsCount } = useLoaderData();
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="rounded border-2 border-slate-200 bg-slate-50 p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-3">Seeding the database</h1>
        <p>
          You currently have <b>{snippetsCount} snippets</b> in your database.
        </p>
        <p>
          Do you want to delete them and re-seed the database with{" "}
          <b>{defaultSnippetsCount} default snippets</b>?
        </p>
        <div className="mt-4 text-right">
          <Link
            to="/"
            className="inline-block mr-2 rounded bg-blue-700 hover:bg-blue-800 px-3 py-1 text-white font-bold">
            No
          </Link>
          <Form method="post" className="inline-block">
            <button
              type="submit"
              name="_action"
              value="seed"
              className="rounded bg-red-600 hover:bg-red-700 px-3 py-1 text-white font-bold">
              Yes
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
