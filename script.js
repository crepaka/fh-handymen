document.addEventListener('DOMContentLoaded', () => {
  Papa.parse('data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    comments: '#',
    complete: results => initPage(results.data)
  });
});

function initPage(data) {
  const categories = [...new Set(data.map(r => r.category))];
  
  // Build dropdown
  const dd = document.createElement('select');
  dd.id = 'category-select';
  categories.forEach((cat, i) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (i === 0) opt.selected = true;
    dd.appendChild(opt);
  });
  const dc = document.getElementById('dropdown-container');
  dc.innerHTML = `<label for="category-select">Select Category:</label>`;
  dc.appendChild(dd);

  // Build tables
  const content = document.getElementById('content-container');
  content.innerHTML = '';
  categories.forEach((cat, i) => {
    const wrapper = document.createElement('div');
    wrapper.id = cat;
    wrapper.className = 'dropdown-content' + (i === 0 ? ' active' : '');
    
    // Create table
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Comments</th>
        </tr>
      </thead>
      <tbody>
        ${data.filter(r => r.category === cat).map(r => `
          <tr>
            <td>${r.id}</td>
            <td>${r.name}</td>
            <td>${r.phone}</td>
            <td><a href="mailto:${r.email}">${r.email}</a></td>
            <td>${r.comments}</td>
          </tr>
        `).join('')}
      </tbody>`;

    const wrap = document.createElement('div');
    wrap.className = 'table-container';
    wrap.appendChild(table);
    wrapper.appendChild(wrap);
    content.appendChild(wrapper);
  });

  // Dropdown change
  dd.addEventListener('change', () => {
    document.querySelectorAll('.dropdown-content').forEach(div =>
      div.classList.toggle('active', div.id === dd.value)
    );
    document.getElementById('table-search').value = '';
    filterRows('');
  });

  // Search/filter
  const searchInput = document.getElementById('table-search');
  searchInput.addEventListener('input', e => filterRows(e.target.value.trim().toLowerCase()));
}

function filterRows(term) {
  document.querySelectorAll('.dropdown-content.active tbody tr').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
}
