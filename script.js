document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('category-select');

  select.addEventListener('change', () => {
    // Hide all category divs
    document.querySelectorAll('.dropdown-content')
      .forEach(div => div.classList.remove('active'));

    // Show the one matching the selected value
    const chosen = select.value;
    const contentDiv = document.getElementById(chosen);
    if (contentDiv) {
      contentDiv.classList.add('active');
    }
  });
});
