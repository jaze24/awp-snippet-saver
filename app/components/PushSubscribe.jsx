import { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/outline";

export default function PushSubscribe({ applicationServerKey }) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      const sw = await navigator.serviceWorker.ready;
      const subscription = await sw.pushManager.getSubscription();
      if (subscription) {
        setIsSubscribed(true);
      }
    }
    checkSubscription();
  }, []);

  const handlePushSubscribe = async () => {
    const sw = await navigator.serviceWorker.ready;
    if (!isSubscribed) {
      // Subscribe
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });
      if (subscription) {
        setIsSubscribed(true);
        sw.showNotification("Thanks for subscribing!");
      }
    } else {
      // Unsubscribe
      const subscription = await sw.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        sw.showNotification("Sorry to see you go");
      }
    }
  };

  return (
    <button
      onClick={handlePushSubscribe}
      className="p-4 cursor-pointer text-zinc-400 flex flex-row items-center gap-1">
      <BellIcon
        width={20}
        height={20}
        className={["transition-colors", isSubscribed && "text-amber-500"]
          .filter(Boolean)
          .join(" ")}
      />
      Subscribe to push notifications
    </button>
  );
}
