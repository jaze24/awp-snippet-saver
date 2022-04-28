import { json } from "remix";

export function loader() {
  return json(
    {
      name: "Snippet Saver",
      short_name: "Snippets",
      icons: [
        {
          src: "/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
      theme_color: "#fafafa",
      background_color: "#fafafa",
      start_url: "/",
      display: "standalone",
    },
    {
      headers: {
        "Cache-Control": "public, max-age=600",
        "Content-Type": "application/manifest+json",
      },
    }
  );
}
