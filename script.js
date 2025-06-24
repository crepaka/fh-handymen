
let tableData = [];
let currentSortKey = '';
let sortAsc = true;

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.csv')
    .then(r => r.text())
    .then(text => {
      tableData = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
      const categories = [...new Set(tableData.map(r => r.category))].sort();
      populateDropdown(categories);
      displayTable(tableData, 'all');
      document.getElementById('category-select').addEventListener('change', e => {
        document.getElementById('search-input').value = '';
        displayTable(tableData, e.target.value);
      });
      document.getElementById('search-input').addEventListener('input', e => {
        const selected = document.getElementById('category-select').value;
        displayTable(tableData, selected, e.target.value.toLowerCase());
      });
    });
});

function populateDropdown(categories) {
  const select = document.getElementById('category-select');
  select.innerHTML = '<option value="all">All</option>';
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

function displayTable(data, category, search = '') {
  let filtered = data.filter(r => {
    const inCategory = category === 'all' || r.category === category;
    const inSearch = Object.values(r).some(v => v.toLowerCase().includes(search));
    return inCategory && inSearch;
  });

  if (category === 'all') {
    filtered.sort((a, b) => a.category.localeCompare(b.category));
  }

  const container = document.getElementById('content-container');
  container.innerHTML = generateTable(filtered, category === 'all');
}

function generateTable(rows, showCategory) {
  const headers = ['#', 'Name', ...(showCategory ? ['Category'] : []), 'Contact', 'Comments'];
  let html = '<div class="table-container"><table><thead><tr>';
  headers.forEach(h => {
    html += `<th onclick="sortTable('${h}')">${h}</th>`;
  });
  html += '</tr></thead><tbody>';
  rows.forEach((r, i) => {
    html += '<tr>';
    html += `<td data-label="#">${i + 1}</td>`;
    html += `<td data-label="Name">${r.name}</td>`;
    if (showCategory) html += `<td data-label="Category">${r.category}</td>`;
    html += `<td data-label="Contact">${formatContact(r.phone, r.email)}</td>`;
    html += `<td data-label="Comments">${r.comments || ''}</td>`;
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function formatContact(phone, email) {
  let out = '';
  if (phone) out += `📞 ${phone}<br>`;
  if (email) out += `✉️ <a href="mailto:${email}">${email}</a>`;
  return out;
}

function sortTable(key) {
  const col = key.toLowerCase();
  if (currentSortKey === col) {
    sortAsc = !sortAsc;
  } else {
    sortAsc = true;
    currentSortKey = col;
  }

  tableData.sort((a, b) => {
    const valA = (a[col] || '').toLowerCase();
    const valB = (b[col] || '').toLowerCase();
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const selected = document.getElementById('category-select').value;
  displayTable(tableData, selected, document.getElementById('search-input').value.toLowerCase());
}
