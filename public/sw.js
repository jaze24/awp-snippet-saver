self.addEventListener("install", () => {
  console.log("SW installed");
});

self.addEventListener("activate", () => {
  console.log("SW activated");
});

self.addEventListener("push", (event) => {
  console.log("Push event received", event);
});
