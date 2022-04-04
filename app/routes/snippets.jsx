import { useEffect, useRef } from "react";
import { SearchIcon, PlusIcon, StarIcon } from "@heroicons/react/outline";
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
            <PlusIcon className="h-6 w-6" />
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
            <SearchIcon className="h-5 w-5" />
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
                      <StarIcon
                        className="h-5 w-5"
                        stroke={snippet.favorite ? "none" : "currentColor"}
                        fill={snippet.favorite ? "currentColor" : "none"}
                      />
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
