import { useEffect, useRef } from "react";
import {
  Outlet,
  useLoaderData,
  Link,
  Form,
  useSearchParams,
  useSubmit,
  useLocation,
} from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader({ request }) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const db = await connectDb();
  const snippets = await db.models.Snippet.find(
    searchQuery
      ? {
          title: { $regex: new RegExp(searchQuery, "i") },
        }
      : {}
  );
  return snippets;
}

export default function Index() {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");
  const snippets = useLoaderData();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const searchFormRef = useRef();

  useEffect(() => {
    if (!searchQuery) {
      searchFormRef.current.reset();
    }
  }, [searchQuery]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3 rounded bg-slate-50 border border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-200">
          <h1 className="text-2xl px-4 font-bold">
            <Link
              to="/snippets"
              className="hover:text-slate-500 transition-colors">
              My code snippets
            </Link>
          </h1>
          <Link
            to="/snippets/new"
            className="text-slate-400 hover:text-slate-600 transition-colors p-4 border-l border-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>
        <Form
          method="get"
          onChange={(e) => submit(e.currentTarget)}
          ref={searchFormRef}
          action={location.pathname}
          className="border-b border-slate-200 flex flex-row items-center">
          <input
            type="search"
            name="q"
            placeholder="Search by title"
            defaultValue={searchParams.get("q")}
            className="p-2 flex-grow bg-slate-50"
          />
          <button
            type="submit"
            className="px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </Form>
        <ul>
          {snippets.map((snippet, i) => {
            return (
              <li key={snippet._id}>
                <Link
                  to={`${snippet._id}?${searchParams.toString()}`}
                  className={[
                    "block p-4 hover:bg-slate-100 transition-colors border-slate-200",
                    i > 0 && "border-t",
                  ]
                    .filter(Boolean)
                    .join(" ")}>
                  <span className="flex flex-row justify-between items-center">
                    <span>{snippet.title}</span>
                    <span
                      className={[
                        snippet.favorite ? "text-amber-500" : "text-slate-400",
                      ]}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                    </span>
                  </span>
                  <span className="block text-slate-400 text-sm">
                    {new Date(snippet.updatedAt).toLocaleString()}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="col-span-9 p-4 rounded bg-slate-50 border border-slate-200">
        <Outlet />
      </div>
    </div>
  );
}
