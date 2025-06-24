function loadCSV(url, callback) {
    fetch(url)
        .then(response => response.text())
        .then(text => {
            const rows = text.trim().split('\n');
            const headers = rows[0].split(',');
            const data = rows.slice(1).map(row => {
                const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // handles commas in quotes
                return headers.reduce((obj, header, i) => {
                    obj[header.trim()] = values[i]?.replace(/^"|"$/g, '').trim();
                    return obj;
                }, {});
            });
            callback(data);
        });
}

function populateTable(data, category = "All") {
    const tbody = document.querySelector("#contactsTable tbody");
    tbody.innerHTML = "";

    let filtered = category === "All" ? data : data.filter(d => d.category === category);
    filtered.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#${index + 1}</td>
            <td>${row.name}</td>
            <td>${row.category}</td>
            <td>${row.phone}</td>
            <td>${row.email}</td>
            <td>${row.comments}</td>
        `;
        tbody.appendChild(tr);
    });
}

loadCSV('data.csv', function(data) {
    const select = document.getElementById("categorySelect");
    const categories = [...new Set(data.map(d => d.category))].sort();
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        select.appendChild(option);
    });

    select.addEventListener("change", () => populateTable(data, select.value));
    populateTable(data, "All");
});
