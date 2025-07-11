
document.addEventListener("DOMContentLoaded", () => {
  const feedbackBtn = document.getElementById("feedbackBtn");
  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackText = document.getElementById("feedbackText");
  const responseMsg = document.getElementById("responseMsg");

  feedbackBtn.addEventListener("click", () => {
    feedbackForm.classList.toggle("hidden");
    responseMsg.classList.add("hidden");
  });

  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(feedbackForm);

    fetch(feedbackForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          feedbackText.value = "";
          responseMsg.classList.remove("hidden");
        } else {
          alert("Error submitting the form.");
        }
      })
      .catch(() => alert("Failed to send. Check internet connection."));
  });

  // Simulated data rendering for example:
  const dummyData = [
    {
      name: "Serhii Perinha",
      category: "Appliance Repair",
      contact: "469-954-5278",
      comments: "Fast and reliable appliance repairs!"
    },
    {
      name: "Anupa",
      category: "Baby Sitter",
      contact: "203-305-1395",
      comments: "$7 per hour Lives on 423 and Main. Very reliable"
    }
  ];

  const container = document.getElementById("cardsContainer");
  dummyData.forEach((row, i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>#${i + 1} ${row.name}</strong><br/>
      <strong>Category:</strong> ${row.category}<br/>
      <strong>Contact:</strong> <a href="tel:${row.contact}">${row.contact}</a><br/>
      <strong>Comments:</strong> ${row.comments}
    `;
    container.appendChild(div);
  });
});
