// URL Web App Apps Script sudah diperbarui
const GAS_URL = 'https://script.google.com/macros/s/AKfycbxNGuUgKW3rSPDx3GIFsHSYF-wdItxrkmp8TRw8jQLx-SiFXggvC64G1scdrIhVpezlFg/exec';

let allData = {};
let currentTab = 'MA';

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

function showTab(tingkatan) {
  currentTab = tingkatan;
  
  // Update active button
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
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Belum ada data izin untuk tingkatan ini.</td></tr>';
    return;
  }
  
  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    // Format tanggal agar lebih rapi (opsional, tergantung format di sheet)
    let tanggal = row[4];
    if (typeof tanggal === 'string' && tanggal.includes('T')) {
      tanggal = tanggal.split('T')[0];
    }
    
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td><span style="background: var(--light-gold); padding: 4px 8px; border-radius: 4px; font-weight: bold; color: var(--primary-green);">${row[2]}</span></td>
      <td>${row[3]}</td>
      <td>${tanggal}</td>
      <td>${row[5]}</td>
      <td>${row[6]}</td>
    `;
    tbody.appendChild(tr);
  });
}
