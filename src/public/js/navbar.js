document.addEventListener('DOMContentLoaded', () => {
    const allDropdowns = document.querySelectorAll('.navbar-dropdown');

    allDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle') || dropdown.previousElementSibling;
        const menu = dropdown.querySelector('.dropdown-menu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllMenus();
            menu.classList.toggle('show');
        });
    });

    document.addEventListener('click', () => {
        closeAllMenus();
    });

    function closeAllMenus() {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('search-type-selector');

  selector.addEventListener('change', () => {
    const type = selector.value;
    if (type) {
      window.location.href = `/search/${type}`;
    }
  });

});document.addEventListener('DOMContentLoaded', () => {
  const dropdownMenu = document.getElementById('search-dropdown-menu');
  const label = document.getElementById('search-dropdown-label');

  dropdownMenu.querySelectorAll('button[data-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      label.textContent = btn.textContent;
      if (type) {
        window.location.href = `/search/${type}`;
      }
    });
  });
});
