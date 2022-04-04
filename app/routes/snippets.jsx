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
  useParams,
} from "remix";
import connectDb from "~/db/connectDb.server.js";

const DEFAULT_SORT_FIELD = "updatedAt";

export async function loader({ request }) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const sortField = url.searchParams.get("sort") ?? DEFAULT_SORT_FIELD;

  const db = await connectDb();
  const snippets = await db.models.Snippet.find(
    searchQuery
      ? {
          title: { $regex: new RegExp(searchQuery, "i") },
        }
      : {}
  ).sort({
    [sortField]: sortField === "title" ? 1 : -1,
  });
  return snippets;
}

export default function Index() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const params = useParams();
  const snippets = useLoaderData();
  const submit = useSubmit();
  const searchFormRef = useRef();

  useEffect(() => {
    if (!location.search) {
      searchFormRef.current.reset();
    }
  }, [location.search]);

  return (
    <div className="min-h-screen grid grid-cols-12 gap-4">
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
          className="border-b border-slate-200">
          <div className="flex flex-row items-center border-b border-slate-200">
            <input
              type="search"
              name="q"
              placeholder="Search by title"
              defaultValue={searchQuery}
              className="px-4 py-2 flex-grow bg-slate-50 isolate"
            />
            <button
              type="submit"
              className="px-4 py-2 text-slate-400 hover:text-slate-600 transition-colors">
              <SearchIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-row items-center">
            <span className="pl-4 text-sm text-slate-400 flex-grow">
              Sort by:
            </span>
            <SortFilter value="title" searchParams={searchParams}>
              Title
            </SortFilter>
            <SortFilter value="updatedAt" searchParams={searchParams}>
              Updated
            </SortFilter>
            <SortFilter value="favorite" searchParams={searchParams}>
              Favorite
            </SortFilter>
          </div>
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
                    params.snippetId === snippet._id && "bg-slate-100",
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

function SortFilter({ value, searchParams, children }) {
  const defaultChecked =
    searchParams.get("sort") === value ||
    (!searchParams.get("sort") && value === DEFAULT_SORT_FIELD);
  const id = `sort-${value}`;
  return (
    <div>
      <input
        type="radio"
        name="sort"
        defaultChecked={defaultChecked}
        value={value}
        id={id}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="block cursor-pointer text-sm hover:text-slate-600 border-l border-slate-200 px-4 py-2 transition-colors text-slate-400 peer-checked:text-slate-600 peer-checked:bg-slate-100">
        {children}
      </label>
    </div>
  );
}
