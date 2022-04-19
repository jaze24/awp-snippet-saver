import { Form, json, redirect, useLoaderData } from "remix";
import { sessionCookie } from "~/cookies.js";

export async function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionCookie.serialize({ userId: "1001" }),
    },
  });
}

export async function loader({ request }) {
  return json(await sessionCookie.parse(request.headers.get("Cookie")));
}

export default function Login() {
  const cookie = useLoaderData();
  return (
    <div className="m-3">
      <h2>Current session cookie:</h2>
      <pre className="my-3 p-4 border rounded">
        {JSON.stringify(cookie, null, 2)}
      </pre>
      <Form reloadDocument method="post">
        <button type="submit" className="my-3 p-2 border rounded">
          Login
        </button>
      </Form>
    </div>
  );
}
