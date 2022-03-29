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
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center mb-4">
          <Form method="post">
            <button
              name="_action"
              value="favorite"
              type="submit"
              className={[
                "block mr-2 hover:text-slate-700 transition-colors",
                snippet.favorite ? "text-amber-500" : "text-slate-400",
              ].join(" ")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke={snippet.favorite ? "none" : "currentColor"}
                fill={snippet.favorite ? "currentColor" : "none"}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
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
            className="transition-colors text-slate-400 hover:text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
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
