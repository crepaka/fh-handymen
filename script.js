function showCategory(categoryId) {
  // Hide all tab contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));

  // Remove active class from all buttons
  const buttons = document.querySelectorAll('.tab-button');
  buttons.forEach(button => button.classList.remove('active'));

  // Show the selected tab content
  document.getElementById(categoryId).classList.add('active');

  // Mark the clicked button as active
  const activeButton = Array.from(buttons).find(btn =>
    btn.getAttribute('onclick').includes(categoryId)
  );
  activeButton.classList.add('active');
}

