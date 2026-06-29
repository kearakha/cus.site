GitHub Sustainability Plan

Tujuan: streak hijau jalan terus tanpa commit sampah. Tiap task di bawah = 1 commit berkualitas = 1 hari hijau. Kerjain pakai Claude Code.

Aturan main:

1 hari minimal 1 task selesai → 1 commit bermakna.
Kalau lagi semangat, boleh lebih. Sisanya simpan buat hari kosong.
Jangan commit kosong / whitespace doang. Kalau mentok, ambil task "receh" dari daftar (ada tanda [receh]).

BAGIAN A — Backlog cus-site (prioritas utama)

App: Generator website instan UMKM, multi-tenant via wildcard subdomain (\*.cus.site).
Stack: Next.js 14 App Router, Prisma + PostgreSQL, OpenAI-compatible API.

Yang sudah ada: onboarding wizard 5-step, AI generate konten, 3 template, magic link auth + owner claim, dashboard edit, image upload, map embed, social links, rate limiting AI.

A1. Yang bikin "beneran SaaS" (gap utama)

Ini hal yang biasanya bikin SaaS terasa matang tapi sering kelewat:

Custom domain per tenant — selain subdomain, owner bisa pasang domain sendiri (CNAME). Pecah: (1) UI input domain, (2) verifikasi DNS, (3) routing middleware baca domain.
Analytics sederhana per tenant — page views, visitor count. Pecah: (1) tabel PageView di Prisma, (2) tracking endpoint, (3) widget angka di dashboard.
SEO per tenant — meta tags dinamis, OG image, sitemap.xml per subdomain. Pecah jadi 3 commit.
Draft vs Published state — owner bisa edit tanpa langsung live. Pecah: (1) field status di model, (2) toggle UI, (3) logic render publik baca yang published.
Template ke-4 & ke-5 — tambah variasi vibe (misal: Bold, Minimal). Tiap template = 1 commit.

A2. AI improvement (sesuai minatmu ke otomasi AI)

Regenerate per section — sekarang generate sekali; bikin tombol regenerate khusus 1 section (hero/about/produk).
AI tone selector — user pilih tone konten (formal/santai/lucu) sebelum generate.
AI image alt-text generator — auto-isi alt text gambar buat aksesibilitas + SEO.
AI product description — input nama produk → AI buat deskripsi jualan.
Streaming response — output AI muncul bertahap (UX lebih hidup) pakai streaming.

A3. Polish & DX (receh tapi sah)

[receh] Loading skeleton di dashboard.
[receh] Empty state ilustrasi (belum ada produk/gambar).
[receh] Toast notification (sukses/gagal).
[receh] Dark mode dashboard.
[receh] Validasi form lebih baik (zod schema).
[receh] README proper + screenshot (penting buat porto).
[receh] Error boundary + halaman 404/500 custom.

BAGIAN B — Backlog improve project lain

Cadangan kalau bosan sama cus-site. Tiap project butuh dicek dulu fiturnya, tapi pola umum improve:

laris — (cek dulu app apa; isi setelah audit)
vesta — sudah 4 minggu nggak disentuh, kandidat "revive". Mulai dari: update dependency, perbaiki README, lalu 1 fitur baru.
stillwork — (isi setelah audit)
Fineiro (ml-budget-planner) — backend Express + ML. Ide: tambah kategori prediksi, export laporan, chart visualisasi.
random-dinner-picker — kecil & fun. Ide: simpan history, filter by mood/budget, share hasil.

TODO: lengkapi bagian ini nanti dengan audit per project (git log, lihat fitur).

BAGIAN C — Ide project baru (cadangan jangka panjang)

Dipakai kalau semua project existing udah mentok. Disesuaikan skill kamu: Laravel, Next.js, Blockchain.

Invoice generator UMKM (Laravel/Next) — nyambung tema cus-site, bisa jadi produk terpisah.
On-chain certificate verifier (Blockchain + Next) — upload sertifikat → hash ke chain → verifikasi publik. Bagus buat porto blockchain.
Tipping jar Web3 (Blockchain) — terima donasi crypto + dashboard. Kecil tapi nunjukin skill smart contract.
API rate-limit-as-a-service (Laravel) — tema yang udah kamu kuasai dari cus-site.
Personal finance + AI insight (Next + AI) — kembangin konsep Fineiro jadi lebih lengkap.

BAGIAN D — Sistem "hari ini ngapain"

Biar nggak mikir tiap pagi:

Default: ambil 1 task dari Bagian A (urut dari atas).
Lagi males/sibuk: ambil 1 task [receh]. Tetap commit bermakna.
Lagi semangat: ambil 1 task A1/A2 yang besar, pecah jadi beberapa commit (sebar ke beberapa hari kalau perlu).
Bosan cus-site: pindah ke Bagian B.
Semua mentok: mulai 1 project dari Bagian C.

Prinsip: selalu ada yang bisa dikerjain. Streak putus bukan karena nggak ada ide, tapi karena nggak punya daftar. Sekarang kamu punya.
