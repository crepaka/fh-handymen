document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse the CSV
  Papa.parse('data.csv', {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      initPage(data);
    }
  });
});

function initPage(data) {
  // 2. Determine unique categories
  const categories = [...new Set(data.map(r => r.category))];

  // 3. Build the dropdown
  const dd = document.createElement('select');
  dd.id = 'category-select';
  categories.forEach((cat, i) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = capitalize(cat);
    if (i === 0) opt.selected = true;
    dd.appendChild(opt);
  });
  const dc = document.getElementById('dropdown-container');
  const lbl = document.createElement('label');
  lbl.htmlFor = dd.id;
  lbl.textContent = 'Select Category: ';
  dc.append(lbl, dd);

  // 4. Create one table container per category
  const content = document.getElementById('content-container');
  categories.forEach((cat, i) => {
    const wrapper = document.createElement('div');
    wrapper.id = cat;
    wrapper.className = 'dropdown-content' + (i === 0 ? ' active' : '');
    
    // Build table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Comments</th>
      </tr>`;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    // Filter rows for this category
    data
      .filter(r => r.category === cat)
      .forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row.name}</td>
          <td>${row.phone}</td>
          <td><a href="mailto:${row.email}">${row.email}</a></td>
          <td>${row.comments}</td>`;
        tbody.appendChild(tr);
      });
    table.appendChild(tbody);

    // Wrap & append
    const tblWrap = document.createElement('div');
    tblWrap.className = 'table-container';
    tblWrap.appendChild(table);
    wrapper.appendChild(tblWrap);
    content.appendChild(wrapper);
  });

  // 5. Wire up onchange
  dd.addEventListener('change', () => {
    const chosen = dd.value;
    document.querySelectorAll('.dropdown-content').forEach(div => {
      div.classList.toggle('active', div.id === chosen);
    });
  });
}

// helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
