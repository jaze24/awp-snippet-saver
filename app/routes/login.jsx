import { Form, json, redirect, useLoaderData } from "remix";
import { getSession, commitSession } from "~/sessions.js";

export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", "1001");

  return redirect("/login", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    userId: session.get("userId"),
  });
}

export default function Login() {
  const { userId } = useLoaderData();
  return (
    <div className="m-3">
      <h2>Current userId:</h2>
      <pre className="my-3 p-4 border rounded">{userId}</pre>
      <Form reloadDocument method="post">
        <button type="submit" className="my-3 p-2 border rounded">
          Login
        </button>
      </Form>
    </div>
  );
}
