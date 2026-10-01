const GAS_URL = 'https://script.google.com/macros/s/AKfycbxNGuUgKW3rSPDx3GIFsHSYF-wdItxrkmp8TRw8jQLx-SiFXggvC64G1scdrIhVpezlFg/exec';

let allData = {};
let currentTab = 'MA';
let currentFilterBulan = 'Semua'; // Variabel baru untuk filter

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

function fetchData() {
  fetch(GAS_URL)
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        allData = result.data;
        document.getElementById('loading').style.display = 'none';
        document.getElementById('tableContainer').style.display = 'block';
        renderTable(currentTab);
      } else {
        throw new Error(result.message);
      }
    })
    .catch(error => {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('error').style.display = 'block';
      document.getElementById('error').textContent = 'Gagal memuat data: ' + error.message;
    });
}

// Fungsi baru untuk menerapkan filter
function applyFilter() {
  currentFilterBulan = document.getElementById('filterBulan').value;
  renderTable(currentTab);
}

function showTab(tingkatan) {
  currentTab = tingkatan;
  
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent === tingkatan) {
      btn.classList.add('active');
    }
  });
  
  renderTable(tingkatan);
}

function renderTable(tingkatan) {
  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  
  const data = allData[tingkatan] || [];
  let visibleIndex = 1; // Untuk penomoran ulang berdasarkan hasil filter
  
  // Filter data berdasarkan bulan
  const filteredData = data.filter(row => {
    // row[5] adalah indeks kolom "Bulan" (0=Nama, 1=Jabatan, 2=Tingkatan, 3=Hari, 4=Tanggal, 5=Bulan, 6=Jam, 7=Alasan)
    const rowBulan = row[5]; 
    return currentFilterBulan === 'Semua' || rowBulan === currentFilterBulan;
  });
  
  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align: center;">Belum ada data izin untuk tingkatan dan bulan ini.</td></tr>';
    return;
  }
  
  filteredData.forEach((row) => {
    const tr = document.createElement('tr');
    let tanggal = row[4];
    if (typeof tanggal === 'string' && tanggal.includes('T')) {
      tanggal = tanggal.split('T')[0];
    }
    
    tr.innerHTML = `
      <td>${visibleIndex++}</td>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td><span style="background: var(--light-gold); padding: 4px 8px; border-radius: 4px; font-weight: bold; color: var(--primary-green);">${row[2]}</span></td>
      <td>${row[3]}</td>
      <td>${tanggal}</td>
      <td><strong>${row[5]}</strong></td> <!-- Menampilkan Bulan -->
      <td>${row[6]}</td>
      <td>${row[7]}</td>
    `;
    tbody.appendChild(tr);
  });
}
