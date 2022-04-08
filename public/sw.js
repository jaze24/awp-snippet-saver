self.addEventListener("install", () => {
  console.log("SW installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("SW activated");
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title);
});
