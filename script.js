
document.addEventListener('DOMContentLoaded', () => {
  fetch('data.csv')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }
      return response.text();
    })
    .then(csvText => {
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
  let categories = [...new Set(data.map(r => r.category))];
  categories.sort((a, b) => a.localeCompare(b));

  const dc = document.getElementById('dropdown-container');
  dc.innerHTML = `<label for="category-select">Select Category:</label>`;
  const dd = document.createElement('select');
  dd.id = 'category-select';

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All';
  dd.appendChild(allOption);

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    dd.appendChild(opt);
  });
  dc.appendChild(dd);

  const content = document.getElementById('content-container');
  content.innerHTML = '';

  categories.forEach(cat => {
    const section = document.createElement('div');
    section.id = cat;
    section.className = 'dropdown-content';
    section.innerHTML = generateTable(data.filter(r => r.category === cat), false);
    content.appendChild(section);
  });

  const allSection = document.createElement('div');
  allSection.id = 'all';
  allSection.className = 'dropdown-content active';
  allSection.innerHTML = generateTable(data, true);
  content.insertBefore(allSection, content.firstChild);

  dd.addEventListener('change', () => {
    document.querySelectorAll('.dropdown-content').forEach(div =>
      div.classList.toggle('active', div.id === dd.value)
    );
    document.getElementById('table-search').value = '';
    filterRows('');
  });

  document.getElementById('table-search').addEventListener('input', e => {
    filterRows(e.target.value.trim().toLowerCase());
  });
}

function generateTable(data, showCategory) {
  return `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            ${showCategory ? '<th>Category</th>' : ''}
            <th>Contact</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((r, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${r.name}</td>
              ${showCategory ? `<td>${r.category}</td>` : ''}
              <td>
                ${r.phone ? '📞 ' + r.phone + '<br>' : ''}
                ${r.email ? '✉️ <a href="mailto:' + r.email + '">' + r.email + '</a>' : ''}
              </td>
              <td>${r.comments}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function filterRows(term) {
  document.querySelectorAll('.dropdown-content.active tbody tr')
    .forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
}
