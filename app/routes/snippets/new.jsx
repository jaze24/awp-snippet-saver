import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";

export async function action({ request }) {
  const form = await request.formData();
  const formValues = Object.fromEntries(form);
  const db = await connectDb();
  try {
    const newSnippet = await db.models.Snippet.create(formValues);
    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    return json({ errors: error.errors, values: formValues }, { status: 400 });
  }
}

export default function CreateBook() {
  const actionData = useActionData();
  return (
    <div>
      <h1>Create snippet</h1>
      <Form method="post">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          name="title"
          defaultValue={actionData?.values.title}
          id="title"
          className={
            actionData?.errors.title ? "border-2 border-red-500" : null
          }
        />
        {actionData?.errors.title && (
          <p className="text-red-500">{actionData.errors.title.message}</p>
        )}
        <br />
        <button type="submit">Save</button>
      </Form>
    </div>
  );
}
