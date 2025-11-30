# 🖼️ Image Compress App

A simple and fast **image compression service** built with **Express.js**, **Sharp**, and **TypeScript**.  
This app allows users to upload and compress images into smaller file sizes without losing much quality.  
You can also run it as a **Docker container**.

---

## 🚀 Features
✅ Upload & compress single or multiple images  
✅ Choose compression quality (default: 70%)  
✅ Support formats: JPEG, PNG, WEBP  
✅ Auto cleanup temporary files  
✅ Download compressed image instantly  
✅ Ready for Docker deployment  
✅ CI/CD integrated with GitHub Actions (ESLint, SonarQube, Docker Hub)

---

## 🧰 Tech Stack

**Backend:**
- Node.js (Express.js + TypeScript)
- Multer (File Upload)
- Sharp (Image Processing)
- Docker
- GitHub Actions (CI/CD)

**Frontend :**
- React + Axios + TypeScript  
- TailwindCSS 

---

## 🏗️ Project Structure

```bash
image-compress-app/
├── .github/workflows/          
├── logs/                       
├── node_modules/
├── src/
│   ├── compressed/             # Hasil kompres (sementara, dibersihkan otomatis)
│   ├── controllers/
│   │   └── compressController.ts   # Logic utama kompres dan download
│   ├── database/
│   │   ├── migrations/
│   │   │   └── create_logs_table.sql  # Struktur tabel log kompresi
│   │   ├── db.ts              # Koneksi SQLite
│   │   └── init.ts            # Inisialisasi database + auto create table
│   ├── middlewares/
│   │   ├── errorHandler.ts    # Global error handler
│   │   └── multerConfig.ts    # Konfigurasi upload (multer)
│   ├── models/
│   │   └── compressLogModel.ts # Fungsi save log ke database
│   ├── routes/
│   │   └── compressRoute.ts   # Routing endpoint `/service/compress`
│   ├── uploads/               # Tempat penyimpanan upload sementara
│   ├── utils/
│   │   ├── cleanup.ts         # Utility hapus file setelah response
│   │   └── formatBytes.ts     # Utility format ukuran file (MB/KB)
│   └── index.ts               # Entry utama aplikasi
├── uploads/                   # Folder root (fallback kalau belum diproses dist)
├── database/                  # File database SQLite disimpan di sini
│   └── app.db
├── docker-compose.yaml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
