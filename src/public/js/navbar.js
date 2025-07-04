document.addEventListener('DOMContentLoaded', () => {
    const allDropdowns = document.querySelectorAll('.navbar-dropdown');

    allDropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle') || dropdown.previousElementSibling; // תופס גם את האווטאר
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
