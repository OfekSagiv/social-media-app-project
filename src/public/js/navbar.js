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
  const deleteBtn = document.getElementById('delete-account-btn');
  if (!deleteBtn) return;

  deleteBtn.addEventListener('click', async () => {
    const confirmed = confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        alert('Your account has been deleted.');
        window.location.href = '/signup';
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Server error while deleting account');
    }
  });
});
