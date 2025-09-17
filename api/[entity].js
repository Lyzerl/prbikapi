// api/[entity].js
export default async function handler(req, res) {
  // ----- הגבלת מתודה -----
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ----- אימות גישה באמצעות עוגיית Session (HttpOnly) -----
  const REQUIRED = process.env.PUBLIC_ACCESS_KEY || "";
  if (REQUIRED) {
    const cookies = req.headers.cookie || "";
    const acc = cookies
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("acc="));
    const cookieVal = acc ? decodeURIComponent(acc.split("=", 2)[1] || "") : "";
    if (cookieVal !== REQUIRED) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

  // ----- ולידציית ENV -----
  const BASE = (process.env.PRI_BASE || "").replace(/\/$/, "");
  const USER = process.env.PRI_USER || "";
  const PASS = process.env.PRI_PASS || "";
  if (!BASE || !USER || !PASS) {
    return res
      .status(500)
      .json({ error: "Missing PRI_BASE/PRI_USER/PRI_PASS env vars" });
  }

  try {
    const { entity } = req.query;
    const qIndex = req.url.indexOf("?");
    const qs = qIndex >= 0 ? req.url.slice(qIndex) : "";
    const targetUrl = `${BASE}/${encodeURIComponent(entity)}${qs}`;

    const auth =
      "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64");

    const upstream = await fetch(targetUrl, {
      headers: {
        Authorization: auth,
        Accept: "application/json",
      },
    });

    const contentType =
      upstream.headers.get("content-type") || "application/json";
    const text = await upstream.text();
    res.status(upstream.status).setHeader("content-type", contentType).send(text);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
}
