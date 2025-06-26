
async function loadCSV(url) {
  const response = await fetch(url);
  const text = await response.text();
  const rows = text.split('\n').slice(1);
  return rows
    .map(row => row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(cell => cell.replace(/^"|"$/g, '')))
    .filter(cols => cols.length >= 5)
    .map((cols, i) => ({
      id: i + 1,
      name: cols[0],
      category: cols[1],
      phone: cols[2],
      email: cols[3],
      comments: cols[4]
    }));
}

function renderTable(data) {
  const table = document.createElement('table');
  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  ['#', 'Name', 'Category', 'Contact', 'Comments'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });

  const tbody = table.createTBody();
  data.forEach(entry => {
    const row = tbody.insertRow();
    row.insertCell().textContent = entry.id;
    row.insertCell().textContent = entry.name;
    row.insertCell().textContent = entry.category;

    const phoneCell = row.insertCell();
    phoneCell.innerHTML = entry.phone ? `<a href="tel:${entry.phone}">📞 ${entry.phone}</a>` : '';

    const commentsCell = row.insertCell();
    commentsCell.textContent = entry.comments || '';
  });

  const container = document.getElementById('directory');
  container.innerHTML = '';
  container.appendChild(table);
}

function setupFilter(data) {
  const input = document.getElementById('searchInput');
  const select = document.getElementById('categorySelect');

  function filter() {
    const keyword = input.value.toLowerCase();
    const category = select.value;
    const filtered = data.filter(item =>
      (!category || item.category === category) &&
      Object.values(item).some(val => val && val.toLowerCase().includes(keyword))
    );
    renderTable(filtered);
  }

  input.addEventListener('input', filter);
  select.addEventListener('change', filter);
}

function populateCategoryDropdown(data) {
  const categories = [...new Set(data.map(row => row.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const select = document.getElementById('categorySelect');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadCSV('data.csv');
  populateCategoryDropdown(data);
  renderTable(data);
  setupFilter(data);
});
