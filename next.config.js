/** @typedef { import('next').NextConfig } NextConfig */

/** @type { NextConfig } */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ["dashboard.cleansatmining.net", "yam.cleansatmining.com", "cleansatmining.com", "*"], // Ajoutez les domaines d'où proviennent vos images
  },
};

module.exports = nextConfig;
