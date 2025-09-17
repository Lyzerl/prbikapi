
// api/[entity].js
export default async function handler(req, res) {
  // --- בדיקת גישה בעזרת העוגייה שניתנה ע"י /api/session ---
  const REQUIRED = process.env.PUBLIC_ACCESS_KEY || "";
  if (REQUIRED) {
    const cookies = req.headers.cookie || "";
    const acc = cookies
      .split(";")
      .map(s => s.trim())
      .find(s => s.startsWith("acc="));
    const cookieVal = acc ? decodeURIComponent(acc.split("=", 2)[1] || "") : "";
    if (cookieVal !== REQUIRED) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }
  // -----------------------------------------------------------

  // ... משם והלאה הקוד שלך כרגיל (PRI_BASE/PRI_USER/PRI_PASS, fetch ל-Priority וכו') ...
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

