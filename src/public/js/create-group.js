function setButtonLoading(button, isLoading) {
    if (!button) return;

    const originalText = button.getAttribute('data-original-text') || button.textContent;
    button.setAttribute('data-original-text', originalText);

    button.disabled = isLoading;
    button.textContent = isLoading ? 'Creating Group...' : originalText;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('create-group-form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const description = form.description.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!name) {
        toast.error('Group name is required');
        return;
    }

    if (name.length < 3) {
        toast.error('Group name must be at least 3 characters long');
        return;
    }

    if (name.length > 50) {
        toast.error('Group name is too long. Maximum 50 characters allowed.');
        return;
    }

    if (!description) {
        toast.error('Group description is required');
        return;
    }

    if (description.length > 200) {
        toast.error('Description is too long. Maximum 200 characters allowed.');
        return;
    }

    const loadingToast = toast.loading('Creating group...');
    setButtonLoading(submitBtn, true);

    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        toast.hide(loadingToast);
        toast.error(data.error || 'Failed to create group');
        return;
      }

      toast.update(loadingToast, 'Group created successfully! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = `/group/${data._id}`;
      }, 1500);

    } catch (err) {
      console.error('Create group error:', err);
      toast.hide(loadingToast);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setButtonLoading(submitBtn, false);
    }
  });
});
