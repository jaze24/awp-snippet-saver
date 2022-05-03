import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { getSession, commitSession } from "~/sessions.server.js";
import connectDb from "~/db/connectDb.server.js";

export async function action({ request }) {
  const db = await connectDb();
  const session = await getSession(request.headers.get("Cookie"));
  const form = await request.formData();

  if (form.get("password").trim() !== form.get("repeatPassword").trim()) {
    return json(
      { errorMessage: "The entered passwords are not equal" },
      { status: 400 }
    );
  }

  if (form.get("password").trim()?.length < 8) {
    return json(
      { errorMessage: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(form.get("password").trim(), 10);

  try {
    const user = await db.models.User.create({
      username: form.get("username").trim(),
      password: hashedPassword,
    });
    if (user) {
      session.set("userId", user._id);
      return redirect("/snippets", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } else {
      return json(
        { errorMessage: "User couldn't be created" },
        { status: 400 }
      );
    }
  } catch (error) {
    return json(
      {
        errorMessage:
          error.message ??
          error.errors?.map((error) => error.message).join(", "),
      },
      { status: 400 }
    );
  }
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("userId")) {
    return redirect("/snippets");
  }
  return null;
}

export default function Register() {
  const actionData = useActionData();

  return (
    <div className="m-3">
      <h2>Register</h2>
      {actionData?.errorMessage ? (
        <p className="text-red-500 font-bold my-3">{actionData.errorMessage}</p>
      ) : null}
      <Form method="post" className="text-inherit">
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          className="block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
        />
        <input
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          placeholder="Repeat password"
          className="block my-3 border rounded px-2 py-1 w-full lg:w-1/2 bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
        />
        <div className="flex flex-row items-center gap-3">
          <button type="submit" className="my-3 p-2 border rounded">
            Sign up
          </button>
          <span className="italic">or</span>
          <Link to="/login" className="underline">
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
}
