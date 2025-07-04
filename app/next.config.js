const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    config.resolve.alias["@anchor/target"] = path.resolve(
      __dirname,
      "../target",
    );
    return config;
  },
};

module.exports = nextConfig;
