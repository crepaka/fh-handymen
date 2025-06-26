async function loadCSV() {
  const response = await fetch('data.csv');
  const text = await response.text();
  const rows = text.trim().split('\n').map(row => row.split(','));
  const headers = rows.shift();
  return rows.map(row => Object.fromEntries(row.map((val, i) => [headers[i].trim(), val.trim()])));
}

function createCard(entry, index) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="row"><span class="label">#</span> ${index + 1}</div>
    <div class="row"><span class="label">Name</span> ${entry.name}</div>
    <div class="row"><span class="label">Category</span> ${entry.category}</div>
    <div class="row"><span class="label">Contact</span> ${entry.phone ? `📞 <a href="tel:${entry.phone}">${entry.phone}</a>` : ''}</div>
    ${entry.comments ? `<div class="row"><span class="label">Comments</span> ${entry.comments}</div>` : ''}
  `;
  return card;
}

function renderDirectory(data, filterCategory = '', searchTerm = '') {
  const container = document.getElementById('directory');
  container.innerHTML = '';
  const filtered = data.filter(entry =>
    (!filterCategory || entry.category === filterCategory) &&
    (!searchTerm || Object.values(entry).some(val => val.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  filtered.forEach((entry, index) => {
    container.appendChild(createCard(entry, index));
  });
}

function populateCategoryDropdown(data) {
  const select = document.getElementById('categoryFilter');
  const categories = [...new Set(data.map(entry => entry.category))].sort();
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadCSV();
  populateCategoryDropdown(data);
  renderDirectory(data);

  document.getElementById('categoryFilter').addEventListener('change', e => {
    renderDirectory(data, e.target.value, document.getElementById('searchBox').value);
  });

  document.getElementById('searchBox').addEventListener('input', e => {
    renderDirectory(data, document.getElementById('categoryFilter').value, e.target.value);
  });
});
