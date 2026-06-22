/** @type {import('next').NextConfig} */
const nextConfig = {
  // Wildcard subdomain → Vercel akan otomatis route semua subdomain
  // ke aplikasi ini. Pastikan DNS *.cus.site CNAME ke Vercel.
  experimental: {
    // Aktifkan jika pakai server actions di Next 14
    serverActions: { allowedOrigins: ['cus.site', '*.cus.site', 'localhost:3000'] },
  },
  images: {
    // Image remote patterns untuk foto dari input user (kalau ada)
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
