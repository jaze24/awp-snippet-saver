import { useCatch } from "remix";

export default function CatchBoundary() {
  const caught = useCatch();
  return (
    <div className="text-red-500 font-bold">
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}
