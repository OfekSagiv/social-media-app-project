document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-post-form');
  if (!form) return; 

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = form.querySelector('textarea').value.trim();

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
      credentials: 'include'

    });

    const data = await res.json();

    if (res.ok) location.reload();
    else alert(data.message || 'Error');
  });
});
