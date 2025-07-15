document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-post-form');
  const fileInput = document.getElementById('media');
  const fileListDiv = document.getElementById('selected-files-list');
  const accumulatedFiles = [];

  if (!form || !fileInput) return;

  fileInput.addEventListener('change', () => {
    const newFiles = Array.from(fileInput.files);

    const placeholder = fileListDiv.querySelector('.placeholder');
    if (placeholder) placeholder.remove();
    newFiles.forEach(file => {
      accumulatedFiles.push(file);

      const fileElement = document.createElement('div');
      fileElement.textContent = file.name;
      fileListDiv.appendChild(fileElement);
    });

    fileInput.value = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'group') {
      formData.append('groupId', pathParts[2]);
    }


    accumulatedFiles.forEach(file => {
      formData.append('media', file);
    });

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const contentType = res.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await res.json();
      } else {
        throw new Error('Non-JSON response received');
      }

      if (res.ok) {
        location.reload();
      } else {
        alert(result.message || 'Something went wrong.');
      }
    } catch (err) {
      alert('Failed to create post.');
    }
  });
});
