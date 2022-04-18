import { Form, json, redirect, useLoaderData } from "remix";

export function action() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": "userId=1001;Max-Age=10;HttpOnly",
    },
  });
}

export function loader({ request }) {
  return json({
    cookies: request.headers.get("Cookie"),
  });
}

export default function Login() {
  const { cookies } = useLoaderData();
  return (
    <div className="m-3">
      <h2>Current cookies:</h2>
      <pre className="my-3 p-4 border rounded">{cookies}</pre>
      <Form method="post">
        <button type="submit" className="my-3 p-2 border rounded">
          Login
        </button>
      </Form>
    </div>
  );
}
