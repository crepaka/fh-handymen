document.getElementById("feedbackBtn").addEventListener("click", function() {
  const form = document.getElementById("feedbackForm");
  form.style.display = form.style.display === "block" ? "none" : "block";
});

document.getElementById("contact-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const form = event.target;
  fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      document.getElementById("feedbackMessage").textContent = "Thanks! Your feedback was sent.";
      form.reset();
      setTimeout(() => {
        document.getElementById("feedbackForm").style.display = "none";
        document.getElementById("feedbackMessage").textContent = "";
      }, 3000);
    } else {
      document.getElementById("feedbackMessage").textContent = "Oops! There was a problem.";
    }
  });
});

// dummy CSV-based example
const data = [
  {
    name: "John Doe",
    category: "Plumber",
    phone: "123-456-7890",
    comments: "Very reliable and affordable service"
  }
];

function renderData(entries) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";
  entries.forEach((item, index) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");
    entryDiv.innerHTML = `
      <strong>#${index + 1} ${item.name}</strong><br/>
      <strong>Category:</strong> ${item.category}<br/>
      <strong>Contact:</strong> 📞 <a href="tel:${item.phone}">${item.phone}</a><br/>
      <strong>Comments:</strong> ${item.comments}
    `;
    resultsDiv.appendChild(entryDiv);
  });
}

document.addEventListener("DOMContentLoaded", () => renderData(data));
