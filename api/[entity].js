// api/[entity].js
export default async function handler(req, res) {
  // --- חובה: מפתח גישה פשוט (אופציונלי, אם הגדרת ב-ENV) ---
  const ACCESS_KEY = process.env.PUBLIC_ACCESS_KEY || "";
  const providedKey = req.headers["x-access-key"] || req.query.key || "";
  if (ACCESS_KEY && providedKey !== ACCESS_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // --- בדיקת ENV הכרחיים ---
  const BASE = (process.env.PRI_BASE || "").replace(/\/$/, "");
  const USER = process.env.PRI_USER || "";
  const PASS = process.env.PRI_PASS || "";
  if (!BASE || !USER || !PASS) {
    return res.status(500).json({ error: "Missing PRI_BASE/PRI_USER/PRI_PASS env vars" });
  }

  try {
    const { entity } = req.query;
    const qIndex = req.url.indexOf("?");
    const qs = qIndex >= 0 ? req.url.slice(qIndex) : "";
    const targetUrl = `${BASE}/${encodeURIComponent(entity)}${qs}`;

    const auth = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

    const r = await fetch(targetUrl, {
      headers: { Authorization: auth, Accept: "application/json" },
    });

    const contentType = r.headers.get("content-type") || "application/json";
    const bodyText = await r.text();
    res.status(r.status).setHeader("content-type", contentType).send(bodyText);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
}
