document.addEventListener('DOMContentLoaded', () => {
  // Fetch the CSV over HTTP
  fetch('data.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }
      return response.text();
    })
    .then(csvText => {
      // Parse the fetched text
      const { data } = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        comments: '#'
      });
      initPage(data);
    })
    .catch(err => {
      console.error('Failed to load data.csv:', err);
      const container = document.getElementById('content-container');
      container.innerHTML = `<p style="color:red">Error loading data.</p>`;
    });
});

function initPage(data) {
  const categories = [...new Set(data.map(r => r.category))];

  // Build dropdown
  const dc = document.getElementById('dropdown-container');
  dc.innerHTML = `<label for="category-select">Select Category:</label>`;
  const dd = document.createElement('select');
  dd.id = 'category-select';
  categories.forEach((cat, i) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    if (i === 0) opt.selected = true;
    dd.appendChild(opt);
  });
  dc.appendChild(dd);

  // Build the tables
  const content = document.getElementById('content-container');
  content.innerHTML = '';
  categories.forEach((cat, idx) => {
    const section = document.createElement('div');
    section.id = cat;
    section.className = 'dropdown-content' + (idx === 0 ? ' active' : '');

    // Table markup
    const table = document.createElement('table');
    table.innerHTML = `
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Comments</th>
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
          </tr>`).join('')}
      </tbody>`;

    const wrap = document.createElement('div');
    wrap.className = 'table-container';
    wrap.appendChild(table);
    section.appendChild(wrap);
    content.appendChild(section);
  });

  // Wire dropdown change
  dd.addEventListener('change', () => {
    document.querySelectorAll('.dropdown-content')
      .forEach(div => div.classList.toggle('active', div.id === dd.value));
    document.getElementById('table-search').value = '';
    filterRows('');
  });

  // Search filter
  document.getElementById('table-search').addEventListener('input', e => {
    filterRows(e.target.value.trim().toLowerCase());
  });
}

function filterRows(term) {
  document.querySelectorAll('.dropdown-content.active tbody tr')
    .forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
}
