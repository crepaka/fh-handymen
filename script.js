
let originalData = [];
let currentSort = { key: null, asc: true };

function loadCSV() {
  Papa.parse("data.csv", {
    download: true,
    header: true,
    complete: function(results) {
      originalData = results.data.filter(row => row.name);
      populateCategoryFilter(originalData);
      renderData(originalData);
    }
  });
}

function populateCategoryFilter(data) {
  const categories = [...new Set(data.map(row => row.category).filter(Boolean))].sort();
  const select = document.getElementById("category");
  select.innerHTML = '<option value="All">All</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function renderData(data) {
  const tbody = document.querySelector("#data-table tbody");
  const cards = document.getElementById("cards-container");
  tbody.innerHTML = "";
  cards.innerHTML = "";

  const filteredData = applyFilters(data);

  filteredData.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.name}</td>
      <td>${row.category}</td>
      <td><a href="tel:${row.phone}">📞 ${row.phone}</a></td>
      <td>${row.comments}</td>
    `;
    tbody.appendChild(tr);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-number"># ${index + 1}</div>
      <div><strong>Name</strong><br>${row.name}</div>
      <div><strong>Contact</strong><br><a href="tel:${row.phone}">📞 ${row.phone}</a></div>
      <div><strong>Comments</strong><br>${row.comments}</div>
    `;
    cards.appendChild(card);
  });
}

function applyFilters(data) {
  const category = document.getElementById("category").value;
  const search = document.getElementById("search").value.toLowerCase();

  return data.filter(row => {
    const matchesCategory = category === "All" || row.category === category;
    const matchesSearch = Object.values(row).some(val => val && val.toLowerCase().includes(search));
    return matchesCategory && matchesSearch;
  });
}

function handleFilterChange() {
  renderData(originalData);
}

function sortBy(key) {
  const asc = currentSort.key === key ? !currentSort.asc : true;
  currentSort = { key, asc };
  originalData.sort((a, b) => {
    if (!a[key]) return 1;
    if (!b[key]) return -1;
    return asc ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
  });
  renderData(originalData);
}

document.addEventListener("DOMContentLoaded", function() {
  loadCSV();
  document.getElementById("search").addEventListener("input", handleFilterChange);
  document.getElementById("category").addEventListener("change", handleFilterChange);
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", () => sortBy(th.dataset.sort));
  });
});
