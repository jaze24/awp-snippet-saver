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
  const db = await connectDb();
  switch (formData.get("_action")) {
    case "delete":
      await db.models.Snippet.findByIdAndDelete(params.snippetId);
      return redirect("/snippets");
    case "favorite":
      const snippet = await db.models.Snippet.findById(params.snippetId);
      snippet.favorite = !snippet.favorite;
      await snippet.save();
      return null;
  }
}

export default function SnippetPage() {
  const snippet = useLoaderData();
  return (
    <div>
      <div className="flex flex-row items-start justify-between">
        <div className="flex flex-row items-center mb-4">
          <Form method="post">
            <button
              name="_action"
              value="favorite"
              type="submit"
              className="mr-2 text-slate-400 hover:text-slate-700 transition-colors text-xl">
              {snippet.favorite ? "★" : "☆"}
            </button>
          </Form>
          <h1 className="text-2xl font-bold">{snippet.title}</h1>
        </div>
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
      <div className="relative my-3 rounded p-2 bg-slate-800 text-green-400 leading-6">
        <code className="absolute top-2 right-2 font-semibold text-sm text-slate-400">
          {snippet.programmingLanguage}
        </code>
        <code>
          <pre>{snippet.code}</pre>
        </code>
      </div>
      <div className="my-3">
        <code>
          <pre>{snippet.description}</pre>
        </code>
      </div>
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
