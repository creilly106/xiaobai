/**
 * Which deployment is live, so a page that has been open across an update can
 * tell it's stale (see components/app-updates.tsx).
 */
export function GET() {
  return Response.json(
    { id: process.env.VERCEL_DEPLOYMENT_ID ?? null },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
