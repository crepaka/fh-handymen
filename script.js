
const data = [{'name': 'Andros Electrician', 'category': 'electricians', 'phone': '214-476-0443', 'email': nan, 'comments': 'Very Good'}, {'name': 'Hosay', 'category': 'electricians', 'phone': '818-233-2017', 'email': nan, 'comments': nan}, {'name': 'Serhii Perinha', 'category': 'Appliance Repair', 'phone': '469-954-5278', 'email': nan, 'comments': nan}, {'name': 'Roger', 'category': 'Water Softner/Filter', 'phone': '469-679-1788', 'email': nan, 'comments': nan}, {'name': 'Nick - American Green Sprinklers', 'category': 'Sprinkler', 'phone': '214-563-5968', 'email': nan, 'comments': 'He is good and with reasonable price, responds quick in whatsapp as well'}, {'name': 'Kajol CAB service', 'category': 'Cab/Taxi Services', 'phone': '972-352-8434', 'email': nan, 'comments': 'Can Carry 6+ Bagscab'}, {'name': 'James Cab Driver', 'category': 'Cab/Taxi Services', 'phone': '616-558-4221', 'email': nan, 'comments': 'He does it for $50 to airport (you can refer Subhash Nair as reference)'}, {'name': 'DLS (Limo) Transport', 'category': 'Cab/Taxi Services', 'phone': '214-400-9181 or 972-900-5522', 'email': 'dfwlimosam@gmail.com', 'comments': 'Four people and their luggage, excellent service from FH guys'}, {'name': 'Srini Gadiparthy', 'category': 'HVAC (Central AC and Heating)', 'phone': '714-515-8553', 'email': nan, 'comments': nan}, {'name': 'Jojo', 'category': 'HVAC (Central AC and Heating)', 'phone': '929-285-7682', 'email': nan, 'comments': nan}, {'name': 'Angel Gonzalez', 'category': 'HVAC (Central AC and Heating)', 'phone': '929-285-7682', 'email': nan, 'comments': 'most of HVAC guys will ask to replace parts'}, {'name': 'David Locksmith', 'category': 'Locksmith', 'phone': '972-765-1145', 'email': nan, 'comments': nan}, {'name': 'PRECISION WINDOWS', 'category': 'Windows', 'phone': '972-562-8828', 'email': nan, 'comments': nan}, {'name': 'Dario Handyman', 'category': 'Handyman', 'phone': '469-650-2781', 'email': nan, 'comments': 'excellent feedback from FH - he installed cabinet handles and light fixtures and chandeliers for us, string lights outside, assembled and installed some furniture'}];

const tableBody = document.querySelector("#contactsTable tbody");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function renderTable(filteredData) {
  tableBody.innerHTML = "";
  filteredData.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>{index + 1}</td>
      <td>{item.name}</td>
      <td>{item.category}</td>
      <td>{item.phone}</td>
      <td>{item.email}</td>
      <td>{item.comments}</td>
    `;
    tableBody.appendChild(row);
  });
}

function updateTable() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = data.filter(d =>
    (category === "All" || d.category === category) &&
    (d.name.toLowerCase().includes(search) ||
     d.comments.toLowerCase().includes(search))
  );
  renderTable(filtered);
}

function populateCategoryFilter() {
  const categories = Array.from(new Set(data.map(d => d.category))).sort();
  categoryFilter.innerHTML = '<option value="All">All</option>' +
    categories.map(c => `<option value="{c}">{c}</option>`).join('');
}

searchInput.addEventListener("input", updateTable);
categoryFilter.addEventListener("change", updateTable);

populateCategoryFilter();
renderTable(data);
