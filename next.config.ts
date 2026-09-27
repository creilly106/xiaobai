import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Tags each Vercel deployment, so a page left open across an update notices
  // it's stale (Next reloads on navigation; see components/app-updates.tsx).
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
};

export default nextConfig;
