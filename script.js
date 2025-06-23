document.addEventListener('DOMContentLoaded', () => {
  const selectEl = document.getElementById('category-select');

  // initial display setup
  showCategory(selectEl.value);

  selectEl.addEventListener('change', () => {
    showCategory(selectEl.value);
  });

  function showCategory(categoryId) {
    // hide all
    document.querySelectorAll('.dropdown-content')
      .forEach(div => div.classList.remove('active'));
    // show selected
    const chosenDiv = document.getElementById(categoryId);
    if (chosenDiv) chosenDiv.classList.add('active');
  }
});
