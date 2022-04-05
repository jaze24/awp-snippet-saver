import { Form, redirect, json, useActionData } from "remix";
import connectDb from "~/db/connectDb.server";

import EditSnippetForm from "~/components/EditSnippetForm.jsx";

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
