// Prisma seed — buat 3 sample bisnis (1 per vibe) untuk testing visual.
// Usage: npx tsx prisma/seed.ts
// Atau otomatis via `prisma db seed` kalau sudah di-config di package.json.

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

const SAMPLES = [
  {
    subdomain: 'kopisrawung',
    namaBisnis: 'Kopi Srawung',
    jenisBisnis: 'Kafe / Restoran',
    lokasi: 'Jl. Kaliurang KM 5, Yogyakarta',
    whatsapp: '6281234567890',
    email: 'demo@cus.site',
    vibe: 'casual' as const,
    accentColor: 'f59e0b',
    heroHeadline: 'Ngopi Santai, Obrolan Panjang',
    heroSubtext:
      'Tempat ngumpul yang pas buat ngerjain tugas, meeting ringan, atau cuma nunggu macet lewat.',
    aboutParagraph:
      'Kopi Srawung berdiri sejak 2019 di jantung Kaliurang. Kami pilih biji kopi lokal dari petani Temanggung, roasting sendiri setiap minggu biar rasanya konsisten. Suasana sengaja kami bikin homey — bukan buat gaya-gayaan, tapi biar kamu betah.',
    ctaText: 'Mampir Yuk',
    seoTitle: 'Kopi Srawung — Ngopi Asik di Kaliurang, Yogyakarta',
    seoDescription:
      'Kafe lokal di Kaliurang, Yogyakarta. Biji kopi Temanggung, suasana homey, harga ramah di kantong. Buka tiap hari 08.00-23.00.',
    services: [
      { title: 'Kopi Susu Srawung', description: 'Andalan kami. Manis seimbang, kopi strong, susu fresh. Bisa less sugar.' },
      { title: 'Nasi Goreng Srawung', description: 'Nasi goreng signature pakai sambal matah. Porsinya buat yang lagi lapar banget.' },
      { title: 'Wifi + Colokan', description: 'Bawa laptop? Silakan. Stop kontak tersedia di hampir semua meja.' },
    ],
  },
  {
    subdomain: 'klinik-pratama',
    namaBisnis: 'Klinik Pratama Sehat',
    jenisBisnis: 'Klinik / Praktik',
    lokasi: 'Jl. Sudirman No. 88, Jakarta Pusat',
    whatsapp: '6281234567891',
    email: 'demo@cus.site',
    vibe: 'professional' as const,
    accentColor: '1e40af',
    heroHeadline: 'Layanan Kesehatan Terpercaya untuk Keluarga Anda',
    heroSubtext:
      'Ditangani dokter berpengalaman dengan standar medis terkini. Pendaftaran mudah, konsultasi nyaman.',
    aboutParagraph:
      'Klinik Pratama Sehat melayani pemeriksaan umum, konsultasi dokter spesialis, dan tindakan medis minor sejak 2015. Kami berkomitmen memberikan pelayanan kesehatan yang profesional, aman, dan terjangkau untuk seluruh lapisan masyarakat.',
    ctaText: 'Daftar Konsultasi',
    seoTitle: 'Klinik Pratama Sehat — Layanan Kesehatan Terpercaya di Jakarta',
    seoDescription:
      'Klinik terpercaya di Jakarta Pusat. Dokter berpengalaman, peralatan modern, biaya transparan. Buka Senin-Sabtu.',
    services: [
      { title: 'Konsultasi Dokter Umum', description: 'Pemeriksaan menyeluruh, diagnosis akurat, dan resep obat yang tepat.' },
      { title: 'Konsultasi Dokter Spesialis', description: 'Jadwal dokter spesialis jantung, anak, dan kandungan setiap minggu.' },
      { title: 'Medical Check-Up', description: 'Paket MCU lengkap dengan hasil yang dapat di-download dan di-share.' },
    ],
  },
  {
    subdomain: 'spa-bali',
    namaBisnis: 'Svarna Spa & Wellness',
    jenisBisnis: 'Lainnya',
    lokasi: 'Ubud, Bali',
    whatsapp: '6281234567892',
    email: 'demo@cus.site',
    vibe: 'elegant' as const,
    accentColor: '92400e',
    heroHeadline: 'Pengalaman Wellness yang Personal',
    heroSubtext:
      'Ritual spa yang memadukan tradisi Bali dengan teknik holistik modern, dirancang khusus untuk Anda.',
    aboutParagraph:
      'Svarna Spa lahir dari kecintaan kami terhadap kearifan lokal Bali. Setiap perawatan kami racik dari bahan organik pilihan, dilakukan oleh terapis bersertifikasi, di tengah sawah Ubud yang asri.',
    ctaText: 'Reservasi Sekarang',
    seoTitle: 'Svarna Spa Ubud — Luxury Wellness Retreat di Bali',
    seoDescription:
      'Spa premium di Ubud, Bali. Treatment tradisional Bali dengan sentuhan modern. Private suite, organic ingredients.',
    services: [
      { title: 'Svarna Signature Ritual', description: 'Perawatan 120 menit yang memadukan pijat tradisional Bali, lulur, dan flower bath.' },
      { title: 'Couples Retreat', description: 'Suite pribadi dengan jacuzzi dan taman untuk pasangan. Termasuk makan siang organik.' },
      { title: 'Yoga & Meditation', description: 'Sesi pagi di pavilion terbuka, dipandu instruktur bersertifikasi internasional.' },
    ],
  },
  {
    subdomain: 'ironcore-gym',
    namaBisnis: 'IronCore Gym',
    jenisBisnis: 'Lainnya',
    lokasi: 'Jl. Gatot Subroto No. 12, Bandung',
    whatsapp: '6281234567893',
    email: 'demo@cus.site',
    vibe: 'bold' as const,
    accentColor: 'e11d48',
    heroHeadline: 'Jadikan Tubuhmu Mesin Perang',
    heroSubtext:
      'Latihan tanpa batas, trainer bersertifikasi, dan komunitas yang bikin kamu nggak mau skip leg day.',
    aboutParagraph:
      'IronCore Gym berdiri untuk mereka yang serius soal kebugaran. Peralatan lengkap, kelas grup yang intens, dan suasana yang bikin adrenalin naik. Buka dari subuh sampai malam, karena dedikasi nggak kenal jam.',
    ctaText: 'Daftar Sekarang',
    seoTitle: 'IronCore Gym — Fitness Center Terbaik di Bandung',
    seoDescription:
      'Gym modern di Bandung. Peralatan lengkap, personal trainer, kelas grup. Buka 05:00-23:00 setiap hari.',
    services: [
      { title: 'Membership Bulanan', description: 'Akses penuh semua fasilitas dan kelas grup selama 30 hari.' },
      { title: 'Personal Training', description: 'Sesi 1-on-1 dengan trainer bersertifikasi. Program custom sesuai goal.' },
      { title: 'Kelas HIIT', description: 'Kelas high-intensity interval training 45 menit. Bakar kalori maksimal.' },
    ],
  },
  {
    subdomain: 'studio-rupa',
    namaBisnis: 'Studio Rupa',
    jenisBisnis: 'Jasa Profesional',
    lokasi: 'Jl. Kemang Raya No. 28, Jakarta Selatan',
    whatsapp: '6281234567894',
    email: 'demo@cus.site',
    vibe: 'minimal' as const,
    accentColor: '059669',
    heroHeadline: 'Desain yang Bicara untuk Brand Anda',
    heroSubtext:
      'Kami membantu bisnis membangun identitas visual yang konsisten dan berkesan, dari logo hingga kampanye digital.',
    aboutParagraph:
      'Studio Rupa adalah studio desain independen yang fokus pada branding dan visual identity. Kami percaya desain yang baik dimulai dari pemahaman mendalam terhadap cerita di balik setiap brand.',
    ctaText: 'Mulai Proyek',
    seoTitle: 'Studio Rupa — Branding & Design Studio Jakarta',
    seoDescription:
      'Studio desain independen di Jakarta. Branding, logo, packaging, dan kampanye digital. Portofolio lengkap.',
    services: [
      { title: 'Brand Identity', description: 'Riset mendalam, logo system, guidelines, dan aset visual lengkap.' },
      { title: 'Packaging Design', description: 'Desain kemasan yang standout di rak. Dari konsep sampai cetak.' },
      { title: 'Social Media Kit', description: 'Template konten, tone of voice guide, dan kalender visual.' },
    ],
  },
];

async function main() {
  console.log('🌱 Seeding sample data...\n');

  for (const sample of SAMPLES) {
    const ownerToken = randomUUID();

    // Upsert Bisnis
    const bisnis = await prisma.bisnis.upsert({
      where: { subdomain: sample.subdomain },
      update: {},
      create: {
        subdomain: sample.subdomain,
        namaBisnis: sample.namaBisnis,
        jenisBisnis: sample.jenisBisnis,
        lokasi: sample.lokasi,
        whatsapp: sample.whatsapp,
        email: sample.email,
        vibe: sample.vibe,
        ownerToken,
      },
    });

    // Upsert KontenWebsite
    await prisma.kontenWebsite.upsert({
      where: { bisnisId: bisnis.id },
      update: {},
      create: {
        bisnisId: bisnis.id,
        heroHeadline: sample.heroHeadline,
        heroSubtext: sample.heroSubtext,
        aboutParagraph: sample.aboutParagraph,
        ctaText: sample.ctaText,
        seoTitle: sample.seoTitle,
        seoDescription: sample.seoDescription,
        accentColor: sample.accentColor,
      },
    });

    // Replace Layanan
    await prisma.layanan.deleteMany({ where: { bisnisId: bisnis.id } });
    await prisma.layanan.createMany({
      data: sample.services.map((s, i) => ({
        bisnisId: bisnis.id,
        title: s.title,
        description: s.description,
        order: i,
      })),
    });

    console.log(
      `✅ ${sample.subdomain.padEnd(18)} → ${sample.vibe.padEnd(13)} | ${bisnis.namaBisnis}`,
    );
    console.log(`   ownerToken: ${ownerToken}  (simpan untuk test Floating Admin Bar)`);
  }

  console.log('\n🎉 Seed selesai!');
  console.log('\nTest di browser:');
  console.log('  http://kopisrawung.localhost:3000     (casual)');
  console.log('  http://klinik-pratama.localhost:3000  (professional)');
  console.log('  http://spa-bali.localhost:3000        (elegant)');
  console.log('  http://ironcore-gym.localhost:3000    (bold)');
  console.log('  http://studio-rupa.localhost:3000     (minimal)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
