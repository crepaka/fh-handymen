
async function loadCSV() {
  const response = await fetch('data.csv');
  const text = await response.text();
  const rows = text.trim().split('\n').map(row => row.split(','));
  const headers = rows.shift();
  return rows.map(row => {
    const entry = {};
    headers.forEach((h, i) => {
      entry[h.trim()] = (row[i] || "").trim();
    });
    return entry;
  });
}

function createCard(row, index) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="card-line"><strong>#${index + 1}</strong> &nbsp; <span class="card-name">${row.name}</span></div>
    <div class="card-line"><strong>Category:</strong> ${row.category}</div>
    <div class="card-line"><strong>Contact:</strong> <a href="tel:${row.phone}">📞 ${row.phone}</a></div>
    ${row.comments ? `<div class="card-line comments"><strong>Comments:</strong> ${row.comments}</div>` : ''}

  `;

  return card;
}

function renderData(data, categoryFilter = "", search = "") {
  const container = document.getElementById("directory");
  container.innerHTML = "";
  const filtered = data.filter(row => {
    return (!categoryFilter || row.category === categoryFilter) &&
           (!search || Object.values(row).some(val => val.toLowerCase().includes(search.toLowerCase())));
  });

  if (!categoryFilter) {
    filtered.sort((a, b) => {
      const catCompare = a.category.localeCompare(b.category);
      return catCompare !== 0 ? catCompare : a.name.localeCompare(b.name);
    });
   } else {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  
  filtered.forEach((row, index) => {
    container.appendChild(createCard(row, index));
  });
}

function populateDropdown(data) {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(data.map(row => row.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  select.innerHTML = '<option value="">All</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const data = await loadCSV();
  populateDropdown(data);
  renderData(data);

  document.getElementById("categoryFilter").addEventListener("change", e => {
    renderData(data, e.target.value, document.getElementById("searchBox").value);
  });

  document.getElementById("searchBox").addEventListener("input", e => {
    renderData(data, document.getElementById("categoryFilter").value, e.target.value);
  });
});
