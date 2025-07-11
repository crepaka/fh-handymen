document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("feedback-toggle");
  const feedbackBox = document.getElementById("feedback-box");
  const feedbackInput = document.getElementById("feedback-input");
  const feedbackSubmit = document.getElementById("feedback-submit");
  const feedbackMsg = document.getElementById("feedback-message");

  toggleBtn.addEventListener("click", () => {
    feedbackBox.classList.toggle("hidden");
    feedbackMsg.textContent = "";
  });

  feedbackSubmit.addEventListener("click", async () => {
    const message = feedbackInput.value.trim();
    if (!message) return;

    try {
      const response = await fetch("https://formspree.io/f/xkgbdyle", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        feedbackMsg.textContent = "Thank you for your feedback!";
        feedbackInput.value = "";
        setTimeout(() => {
          feedbackBox.classList.add("hidden");
          feedbackMsg.textContent = "";
        }, 3000);
      } else {
        feedbackMsg.textContent = "Failed to send feedback.";
      }
    } catch (err) {
      feedbackMsg.textContent = "Error sending feedback.";
    }
  });
});
