import { Outlet, useLoaderData, Link } from "remix";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = await connectDb();
  const snippets = await db.models.Snippet.find();
  return snippets;
}

export default function Index() {
  const snippets = useLoaderData();

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3 rounded bg-slate-50 bg-slate-5 border border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-200">
          <h1 className="text-2xl p-4 font-bold">
            <Link
              to="/snippets"
              className="hover:text-slate-500 transition-colors">
              My code snippets
            </Link>
          </h1>
          <Link
            to="/snippets/new"
            className="font-bold text-2xl text-slate-400 hover:bg-slate-100 transition-colors p-4 border-l border-slate-200">
            +
          </Link>
        </div>
        <ul>
          {snippets.map((snippet, i) => {
            return (
              <li key={snippet._id}>
                <Link
                  to={snippet._id}
                  className={[
                    "block p-4 hover:bg-slate-100 transition-colors border-slate-200 flex flex-row justify-between items-center",
                    i > 0 && "border-t",
                  ]
                    .filter(Boolean)
                    .join(" ")}>
                  <span>{snippet.title}</span>
                  <span className="text-slate-400">
                    {snippet.favorite ? "★" : "☆"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="col-span-9 p-4 rounded bg-slate-50 bg-slate-5 border border-slate-200">
        <Outlet />
      </div>
    </div>
  );
}
