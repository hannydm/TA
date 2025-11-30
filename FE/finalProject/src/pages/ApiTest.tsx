// src/pages/ApiTest.tsx

import React, { useEffect, useState } from 'react';

// Komponen ini didesain khusus untuk menguji koneksi ke API Django.
const ApiTest = () => {
  // State untuk menyimpan pesan dari backend
  const [pesan, setPesan] = useState<string>("Sedang mencoba terhubung ke backend Django...");
  // State untuk menyimpan error jika ada
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fungsi async untuk mengambil data dari Django
    const ambilData = async () => {
      try {
        // Panggil URL API yang sudah kita buat di Django
        const response = await fetch('http://127.0.0.1:7000/api/test/');
        
        // Jika response gagal (bukan status 200-299), lempar error
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Ubah response menjadi format JSON
        const data = await response.json();
        
        // Tampilkan data lengkap di console browser untuk debugging
        console.log("✅ Data berhasil diterima dari Django:", data);
        
        // Simpan pesan dari backend ke state
        setPesan(data.pesan); // Seharusnya "Halo dari Backend Django!"

      } catch (e: any) {
        // Jika ada error (termasuk error CORS), tangkap di sini
        console.error("❌ Gagal mengambil data:", e);
        setError(`Gagal mengambil data. Pesan error: ${e.message}. Cek console untuk detail.`);
        setPesan("Gagal terhubung ke backend.");
      }
    };

    // Jalankan fungsi tersebut saat komponen pertama kali dimuat
    ambilData();
  }, []); // Array kosong berarti useEffect hanya berjalan sekali

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🔬 Halaman Tes Koneksi API</h1>
      <div style={{ marginTop: '20px', padding: '20px', borderRadius: '8px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
        <h2>Status Koneksi:</h2>
        
        {/* Tampilkan pesan sukses atau error */}
        <p style={{ 
          fontSize: '1.2em', 
          fontWeight: 'bold', 
          color: error ? '#d9534f' : '#5cb85c' 
        }}>
          {error ? error : pesan}
        </p>

        <p style={{ marginTop: '20px', color: '#666' }}>
          Tekan F12 dan buka tab "Console" untuk melihat detail teknisnya.
        </p>
      </div>
    </div>
  );
};

export default ApiTest;
