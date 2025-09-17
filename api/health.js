// api/health.js
export default async function handler(req, res) {
  const hasBase = !!process.env.PRI_BASE;
  const hasUser = !!process.env.PRI_USER;
  const hasPass = !!process.env.PRI_PASS;
  const hasKey  = !!process.env.PUBLIC_ACCESS_KEY; // אופציונלי

  res.status(200).json({
    ok: true,
    env: { PRI_BASE: hasBase, PRI_USER: hasUser, PRI_PASS: hasPass, PUBLIC_ACCESS_KEY: hasKey },
  });
}
