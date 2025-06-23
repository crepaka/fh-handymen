function showDropdownCategory() {
  const select = document.getElementById('category-select');
  const selectedValue = select.value;

  // Hide all contents
  const contents = document.querySelectorAll('.dropdown-content');
  contents.forEach(content => content.classList.remove('active'));

  // Show selected category
  document.getElementById(selectedValue).classList.add('active');
}
