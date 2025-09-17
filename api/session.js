// api/session.js
export default async function handler(req, res) {
  const key = process.env.PUBLIC_ACCESS_KEY || "";
  if (!key) {
    return res.status(500).json({ error: "Missing PUBLIC_ACCESS_KEY" });
  }

  // עוגייה ל-30 יום (2592000 שניות)
  const cookie = [
    `acc=${encodeURIComponent(key)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Secure",
    "Max-Age=2592000",
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}
