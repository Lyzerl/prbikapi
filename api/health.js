// api/health.js
export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    env: {
      PRI_BASE: !!process.env.PRI_BASE,
      PRI_USER: !!process.env.PRI_USER,
      PRI_PASS: !!process.env.PRI_PASS,
      PUBLIC_ACCESS_KEY: !!process.env.PUBLIC_ACCESS_KEY,
    },
  });
}
