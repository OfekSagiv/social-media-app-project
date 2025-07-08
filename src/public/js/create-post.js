document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-post-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = form.querySelector('textarea').value.trim();
    const pathParts = window.location.pathname.split('/');
    const isGroupPage = pathParts[1] === 'group';
    const groupId = isGroupPage ? pathParts[2] : null;

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, groupId }),
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) location.reload();
    else alert(data.message || 'Error');
  });
});
