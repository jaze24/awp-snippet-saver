import { createCookie } from "remix";

export const sessionCookie = createCookie("__session", {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true,
});
