import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Static export — required for Firebase Hosting (no Node.js server)
  output: "export",
  transpilePackages: ["@workspace/ui"],
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION ?? process.env.npm_package_version ?? "1.0.0",
  },
  // headers() is not supported with output:'export' — moved to firebase.json
}

export default nextConfig
