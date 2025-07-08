document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-group-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const description = form.description.value.trim();

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || 'Failed to create group');
      }

      alert('Group created successfully!');
      window.location.href = '/groups';

    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  });
});
