# 📘 Dokumentasi Halaman - Angel Cake'S

## Deskripsi Aplikasi

**Angel Cake'S** adalah platform e-commerce untuk toko kue yang memungkinkan pelanggan melihat, memesan, dan membeli berbagai varian kue secara online. Aplikasi ini dibangun menggunakan Laravel (Backend) dan React dengan Inertia.js (Frontend).

---

## 🏠 Halaman Publik (Tanpa Login)

### 1. Halaman Beranda (`/`)
**File:** `resources/js/Pages/Welcome.jsx`

**Fungsi:**
- Menampilkan landing page utama toko
- Carousel kategori kue dengan auto-scroll dan drag-to-scroll
- Menampilkan produk unggulan
- Statistik toko (pelanggan, varian, rating)
- Tombol navigasi ke halaman produk dan tentang

**Fitur:**
- Hero section dengan animasi
- Kategori kue dalam bentuk carousel
- Produk unggulan dengan fitur wishlist
- Responsif untuk semua ukuran layar

---

### 2. Halaman Produk (`/produk`)
**File:** `resources/js/Pages/Produk.jsx`

**Fungsi:**
- Menampilkan daftar semua produk kue
- Filter berdasarkan kategori
- Pencarian produk berdasarkan nama
- Pagination untuk navigasi produk

**Fitur:**
- Grid produk dengan gambar, nama, harga
- Filter kategori
- Tombol wishlist
- Sorting produk

---

### 3. Detail Produk (`/produk/{id}`)
**File:** `resources/js/Pages/ProdukDetail.jsx`

**Fungsi:**
- Menampilkan detail lengkap produk
- Galeri gambar produk
- Informasi harga dan stok
- Tombol tambah ke keranjang
- Tampilan ulasan produk dari pembeli

**Fitur:**
- Image gallery dengan zoom
- Pemilihan jumlah
- Tambah ke keranjang/wishlist
- Rating dan ulasan produk
- Produk terkait

---

### 4. Halaman Tentang (`/tentang`)
**File:** `resources/js/Pages/Tentang.jsx`

**Fungsi:**
- Menampilkan informasi tentang toko
- Cerita dan sejarah Angel Cake's
- Nilai-nilai dan prinsip toko
- Timeline perjalanan toko
- Profil tim

**Fitur:**
- Hero section
- Section kisah toko
- Cards nilai-nilai (Cinta, Kualitas, Pelanggan, Tepat Waktu)
- Timeline milestone
- Profil tim
- Statistik toko
- Alasan memilih Angel Cake's

---

### 5. Halaman Kontak (`/kontak`)
**File:** `resources/js/Pages/Kontak.jsx`

**Fungsi:**
- Menampilkan informasi kontak toko
- Peta lokasi toko
- Link media sosial
- FAQ (Pertanyaan Umum)

**Fitur:**
- Cards info kontak (alamat, telepon, email, jam operasional)
- Google Maps embed
- Link Instagram, Facebook, WhatsApp
- Accordion FAQ

---

## 🔐 Halaman Autentikasi

### 6. Halaman Login (`/login`)
**File:** `resources/js/Pages/Auth/Login.jsx`

**Fungsi:**
- Form login untuk pengguna terdaftar
- Remember me option
- Link ke halaman registrasi

---

### 7. Halaman Register (`/register`)
**File:** `resources/js/Pages/Auth/Register.jsx`

**Fungsi:**
- Form registrasi pengguna baru
- Validasi email unik
- Konfirmasi password

---

## 👤 Halaman Pengguna (Memerlukan Login)

### 8. Halaman Keranjang (`/keranjang`)
**File:** `resources/js/Pages/Keranjang.jsx`

**Fungsi:**
- Menampilkan produk dalam keranjang
- Update jumlah produk
- Hapus produk dari keranjang
- Kalkulasi total belanja

**Fitur:**
- List item keranjang
- Tombol +/- untuk kuantitas
- Hapus item
- Subtotal per item
- Total keseluruhan
- Tombol checkout

---

### 9. Halaman Checkout (`/checkout`)
**File:** `resources/js/Pages/Checkout.jsx`

**Fungsi:**
- Proses pembayaran pesanan
- Pilih alamat pengiriman
- Kalkulasi ongkos kirim
- Integrasi pembayaran Midtrans

**Fitur:**
- Pilih alamat pengiriman
- Ringkasan pesanan
- Ongkos kirim otomatis
- Pembayaran via Midtrans Snap

---

### 10. Halaman Wishlist (`/wishlist`)
**File:** `resources/js/Pages/Wishlist.jsx`

**Fungsi:**
- Daftar produk favorit pengguna
- Hapus dari wishlist
- Tambah ke keranjang

---

### 11. Halaman Pesanan Saya (`/pesanan`)
**File:** `resources/js/Pages/Pesanan.jsx`

**Fungsi:**
- Riwayat semua pesanan pengguna
- Filter berdasarkan status
- Link ke detail pesanan

**Status Pesanan:**
- `pending` - Menunggu pembayaran
- `processing` - Sedang diproses
- `shipped` - Sedang dikirim
- `delivered` - Selesai
- `cancelled` - Dibatalkan

---

### 12. Detail Pesanan (`/pesanan/{id}`)
**File:** `resources/js/Pages/PesananDetail.jsx`

**Fungsi:**
- Detail lengkap pesanan
- Status pesanan dengan timeline
- Item dalam pesanan
- Informasi pengiriman
- Tombol pembayaran (jika pending)
- Tombol konfirmasi diterima (jika shipped)
- Tombol beri ulasan (jika delivered)

---

### 13. Halaman Alamat Saya (`/profil/alamat`)
**File:** `resources/js/Pages/Profil/Alamat.jsx`

**Fungsi:**
- Kelola alamat pengiriman
- Tambah alamat baru
- Edit alamat
- Hapus alamat
- Set alamat utama/aktif

**Fitur:**
- List alamat dengan nomor telepon
- Modal form untuk tambah/edit
- Chain dropdown Kecamatan → Kelurahan
- Toggle alamat aktif

---

### 14. Halaman Ulasan Saya (`/ulasan`)
**File:** `resources/js/Pages/Ulasan/Index.jsx`

**Fungsi:**
- Daftar ulasan yang diberikan pengguna
- Link ke edit ulasan

---

### 15. Buat Ulasan (`/ulasan/create?pesanan_id={id}`)
**File:** `resources/js/Pages/Ulasan/Create.jsx`

**Fungsi:**
- Form untuk memberikan ulasan produk
- Rating bintang (1-5)
- Komentar tekstual

---

### 16. Edit Ulasan (`/ulasan/{id}/edit`)
**File:** `resources/js/Pages/Ulasan/Edit.jsx`

**Fungsi:**
- Edit ulasan yang sudah diberikan
- Update rating dan komentar

---

## 🔧 Halaman Admin

### 17. Dashboard Admin (`/admin/dashboard`)
**File:** `resources/js/Pages/Admin/Dashboard.jsx`

**Fungsi:**
- Overview statistik toko
- Grafik penjualan
- Pesanan terbaru
- Produk terlaris

---

### 18. Daftar Pembeli (`/admin/pembeli`)
**File:** `resources/js/Pages/Admin/Pembeli/Index.jsx`

**Fungsi:**
- Daftar semua pembeli (user)
- Pencarian pembeli
- Total pesanan per pembeli

---

### 19. Detail Pembeli (`/admin/pembeli/{id}`)
**File:** `resources/js/Pages/Admin/Pembeli/Show.jsx`

**Fungsi:**
- Profil lengkap pembeli
- Riwayat pesanan pembeli

---

### 20. Daftar Pesanan (`/admin/pesanan`)
**File:** `resources/js/Pages/Admin/Pesanan/Index.jsx`

**Fungsi:**
- Daftar semua pesanan
- Filter berdasarkan status
- Pagination

---

### 21. Detail Pesanan Admin (`/admin/pesanan/{id}`)
**File:** `resources/js/Pages/Admin/Pesanan/Show.jsx`

**Fungsi:**
- Detail pesanan pelanggan
- Update status pesanan
- Rincian item pesanan

---

### 22. Laporan Penjualan (`/admin/laporan`)
**File:** `resources/js/Pages/Admin/Laporan/Index.jsx`

**Fungsi:**
- Statistik penjualan
- Grafik penjualan harian
- Filter berdasarkan tanggal
- Produk terlaris
- Export CSV

---

### 23. Daftar Produk (`/admin/produk`)
**File:** `resources/js/Pages/Admin/Produk/Index.jsx`

**Fungsi:**
- CRUD produk
- Upload gambar produk
- Manajemen stok

---

### 24. Daftar Kategori (`/admin/kategori`)
**File:** `resources/js/Pages/Admin/Kategori/Index.jsx`

**Fungsi:**
- CRUD kategori produk

---

### 25. Varian Produk (`/admin/varian-produk`)
**File:** `resources/js/Pages/Admin/VarianProduk/Index.jsx`

**Fungsi:**
- CRUD varian produk
- Manajemen harga dan stok per varian

---

### 26. Daftar Kecamatan (`/admin/kecamatan`)
**File:** `resources/js/Pages/Admin/Kecamatan/Index.jsx`

**Fungsi:**
- CRUD data kecamatan

---

### 27. Ongkos Kirim (`/admin/ongkir`)
**File:** `resources/js/Pages/Admin/Ongkir/Index.jsx`

**Fungsi:**
- CRUD data ongkos kirim per desa/kelurahan
- Berdasarkan kecamatan

---

## 📐 Layout

### UserLayout
**File:** `resources/js/Layouts/UserLayout.jsx`

**Fungsi:**
- Layout untuk halaman pengguna/publik
- Navbar dengan navigasi
- Footer dengan info kontak

---

### AdminLayout
**File:** `resources/js/Layouts/AdminLayout.jsx`

**Fungsi:**
- Layout untuk panel admin
- Sidebar navigasi admin
- Header dengan user info

---

## 🧩 Komponen Utama

### Navbar
**File:** `resources/js/Components/ui/Navbar.jsx`

**Fungsi:**
- Navigasi utama (Beranda, Produk, Tentang, Kontak)
- Icon keranjang dan wishlist dengan badge count
- Dropdown user menu

### Pagination
**File:** `resources/js/Components/ui/Pagination.jsx`

**Fungsi:**
- Navigasi halaman untuk daftar data

### Button
**File:** `resources/js/Components/ui/Button.jsx`

**Fungsi:**
- Tombol dengan berbagai varian dan loading state

---

## 🔑 Sistem Role

| Role | Akses |
|------|-------|
| `admin` | Panel Admin (/admin/*) |
| `user` | Halaman Pelanggan (/, /produk, /pesanan, dll) |

---

## 💳 Integrasi Pembayaran

**Provider:** Midtrans

**Alur Pembayaran:**
1. User checkout → Generate Snap Token
2. Midtrans Snap popup muncul
3. User memilih metode pembayaran
4. Notifikasi webhook dikirim ke `/api/midtrans/notification`
5. Status pesanan diupdate otomatis

---

## 📁 Struktur Folder Frontend

```
resources/js/
├── Components/
│   ├── ui/           # Komponen UI (Button, Navbar, Pagination, dll)
│   └── forms/        # Komponen form (TextInput, FormSelect, dll)
├── Layouts/
│   ├── UserLayout.jsx
│   └── AdminLayout.jsx
└── Pages/
    ├── Welcome.jsx
    ├── Produk.jsx
    ├── ProdukDetail.jsx
    ├── Tentang.jsx
    ├── Kontak.jsx
    ├── Keranjang.jsx
    ├── Checkout.jsx
    ├── Wishlist.jsx
    ├── Pesanan.jsx
    ├── PesananDetail.jsx
    ├── Auth/
    │   ├── Login.jsx
    │   └── Register.jsx
    ├── Profil/
    │   └── Alamat.jsx
    ├── Ulasan/
    │   ├── Index.jsx
    │   ├── Create.jsx
    │   └── Edit.jsx
    └── Admin/
        ├── Dashboard.jsx
        ├── Pembeli/
        ├── Pesanan/
        ├── Laporan/
        ├── Produk/
        ├── Kategori/
        ├── VarianProduk/
        ├── Kecamatan/
        └── Ongkir/
```

---

## 📞 Kontak Support

Untuk bantuan teknis, silakan hubungi:
- Email: info@enjelcakes.com
- WhatsApp: +62 812 3456 7890

---

*Dokumentasi ini dibuat untuk Angel Cake'S E-Commerce Platform*
*Terakhir diperbarui: 24 Januari 2026*
