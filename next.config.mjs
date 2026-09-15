/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid Next.js writing AGENTS.md/CLAUDE.md meta-files into a hiring
  // submission repo where they'd be unexplained noise.
  agentRules: false,
};

export default nextConfig;
