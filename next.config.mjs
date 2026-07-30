/** @type {import('next').NextConfig} */
const nextConfig = {
  // Wildcard subdomain → Vercel akan otomatis route semua subdomain
  // ke aplikasi ini. Pastikan DNS *.cus.site CNAME ke Vercel.
  experimental: {
    // Aktifkan jika pakai server actions di Next 14
    serverActions: { allowedOrigins: ['cus.site', '*.cus.site', 'localhost:3000'] },
  },
  images: {
    // Foto user (logo, cover, layanan) semua di-upload ke Vercel Blob — lihat
    // src/lib/upload.ts. Disempitkan ke hostname Blob supaya next/image tidak
    // jadi open image proxy (hostname: '**' berarti siapa pun bisa nitip
    // resize gambar dari domain manapun lewat /_next/image?url=...).
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;
