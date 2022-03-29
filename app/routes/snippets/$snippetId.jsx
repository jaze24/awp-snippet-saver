import { useLoaderData, useCatch, json, Form, redirect } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ params }) {
  const db = await connectDb();
  const snippet = await db.models.Snippet.findById(params.snippetId);
  if (!snippet) {
    throw new Response(`Couldn't find snippet with id ${params.snippetId}`, {
      status: 404,
    });
  }
  return json(snippet);
}

export async function action({ params, request }) {
  const formData = await request.formData();
  if (formData.get("_action") == "delete") {
    const db = await connectDb();
    await db.models.Snippet.findByIdAndDelete(params.snippetId);
    return redirect("/snippets");
  }
}

export default function SnippetPage() {
  const snippet = useLoaderData();
  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <h1 className="text-2xl font-bold mb-4">{snippet.title}</h1>
        <Form method="post">
          <button
            name="_action"
            value="delete"
            type="submit"
            title="Delete"
            aria-label="Delete"
            className="font-semibold text-xl text-white w-7 h-7 bg-red-500 transition-colors hover:bg-red-600 rounded">
            &times;
          </button>
        </Form>
      </div>
      <code>
        <pre>{JSON.stringify(snippet, null, 2)}</pre>
      </code>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <h1 className="text-red-500 font-bold">
      {error.name}: {error.message}
    </h1>
  );
}
