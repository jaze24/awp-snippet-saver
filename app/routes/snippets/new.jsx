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

export default function CreateSnippet() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="text-2xl font-bold">Create snippet</h1>
      <Form method="post">
        <Input
          name="title"
          label="Title"
          defaultValue={actionData?.values.title}
          errorMessage={actionData?.errors?.title?.message}
        />

        <Input
          type="textarea"
          name="code"
          label="Code"
          defaultValue={actionData?.values.code}
          errorMessage={actionData?.errors?.code?.message}
        />
        <div className="my-3">
          <FormLabel htmlFor="programmingLanguage">
            Programming language
          </FormLabel>
          <select
            name="programmingLanguage"
            className="p-2 appearance-none border border-slate-200">
            <option>HTML</option>
            <option>CSS</option>
            <option>JavaScript</option>
          </select>
        </div>
        <Input
          type="textarea"
          name="description"
          label="Description"
          defaultValue={actionData?.values.description}
          errorMessage={actionData?.errors?.description?.message}
        />

        {Object.keys(actionData?.errors ?? {}).length > 0 && (
          <ul className="mt-3 rounded bg-red-100 border border-red-500 p-3 text-red-500 list-disc list-inside">
            {Object.entries(actionData.errors).map(([key, value]) => (
              <li key={key}>
                <b>{key}:</b> {value.properties.message}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3">
          <Button type="submit">Save</Button>
        </div>
      </Form>
    </div>
  );
}

function Button({ type = "button", children }) {
  return (
    <button
      type={type}
      className="rounded bg-fuchsia-700 text-white font-bold px-3 py-2">
      {children}
    </button>
  );
}

function Input({
  name,
  id = name,
  type = "text",
  label = name,
  defaultValue,
  errorMessage,
}) {
  const inputProps = {
    name: name,
    defaultValue: defaultValue,
    id: id,
    className: [
      "border rounded px-2 py-1 w-full lg:w-1/2",
      errorMessage ? "border-red-500" : "border-slate-200 ",
    ]
      .filter(Boolean)
      .join(" "),
  };

  return (
    <div className="my-3">
      <FormLabel>{label}</FormLabel>
      {type === "textarea" ? (
        <textarea {...inputProps} rows={10}></textarea>
      ) : (
        <input type={type} {...inputProps} />
      )}
      {errorMessage && <p className="mt-1 text-red-500">{errorMessage}</p>}
    </div>
  );
}

function FormLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block font-semibold mb-1">
      {children}
    </label>
  );
}
