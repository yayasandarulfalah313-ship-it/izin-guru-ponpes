const GAS_URL = 'https://script.google.com/macros/s/AKfycbxNGuUgKW3rSPDx3GIFsHSYF-wdItxrkmp8TRw8jQLx-SiFXggvC64G1scdrIhVpezlFg/exec';

document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  document.getElementById('hari').value = days[now.getDay()];
  document.getElementById('bulan').value = months[now.getMonth()]; // Auto-fill Bulan
  
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  document.getElementById('tanggal').value = `${yyyy}-${mm}-${dd}`;
  
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('jam').value = `${hh}:${min}`;
});

document.getElementById('izinForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const btn = document.getElementById('submitBtn');
  const status = document.getElementById('statusMessage');
  
  btn.disabled = true;
  btn.textContent = 'Mengirim...';
  status.textContent = '';

  const formData = {
    nama: document.getElementById('nama').value,
    jabatan: document.getElementById('jabatan').value,
    tingkatan: document.getElementById('tingkatan').value,
    hari: document.getElementById('hari').value,
    tanggal: document.getElementById('tanggal').value,
    bulan: document.getElementById('bulan').value, // Ditambahkan
    jam: document.getElementById('jam').value,
    alasan: document.getElementById('alasan').value
  };

  fetch(GAS_URL, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      status.style.color = 'green';
      status.textContent = '✅ ' + data.message;
      document.getElementById('izinForm').reset();
      
      // Reset ke nilai default saat ini
      const now = new Date();
      const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      document.getElementById('hari').value = days[now.getDay()];
      document.getElementById('bulan').value = months[now.getMonth()];
      
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      document.getElementById('tanggal').value = `${yyyy}-${mm}-${dd}`;
      
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      document.getElementById('jam').value = `${hh}:${min}`;
    } else {
      throw new Error(data.message);
    }
  })
  .catch(error => {
    status.style.color = 'red';
    status.textContent = '❌ Gagal: ' + error.message;
    btn.disabled = false;
    btn.textContent = 'Kirim Pengajuan Izin';
  });
});
