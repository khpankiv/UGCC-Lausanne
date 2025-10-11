document.addEventListener('DOMContentLoaded', function() {
  const headerPlaceholder = document.getElementById('header-include');
  if (headerPlaceholder) {
    fetch('../partials/header.html')
      .then(response => response.text())
      .then(html => {
        headerPlaceholder.innerHTML = html;
      });
  }
});
