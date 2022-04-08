import { redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server.js";

import EditSnippetForm from "~/components/EditSnippetForm.jsx";
import { notifyAll } from "~/db/sendNotification.server";

export async function action({ request }) {
  const form = await request.formData();
  const formValues = Object.fromEntries(form);
  const db = await connectDb();
  try {
    const newSnippet = await db.models.Snippet.create(formValues);
    await notifyAll({
      title: `A new snippet was created: /snippets/${newSnippet._id}`,
    });
    return redirect(`/snippets/${newSnippet._id}`);
  } catch (error) {
    return json({ errors: error.errors, values: formValues }, { status: 400 });
  }
}

export default function CreateSnippet() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="text-2xl font-bold">Create snippet</h1>
      <EditSnippetForm
        submittedValues={actionData?.values}
        errors={actionData?.errors}
      />
    </div>
  );
}
