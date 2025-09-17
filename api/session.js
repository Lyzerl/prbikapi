// api/session.js
export default async function handler(req, res) {
  // אפשר לאפשר גם GET; כאן משתמשים ב-POST כברירת מחדל
  if (!["POST", "GET"].includes(req.method)) {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const key = process.env.PUBLIC_ACCESS_KEY || "";
  if (!key) {
    return res.status(500).json({ error: "Missing PUBLIC_ACCESS_KEY" });
  }

  const cookie = [
    `acc=${encodeURIComponent(key)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Secure",
    "Max-Age=2592000", // 30 ימים
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}
