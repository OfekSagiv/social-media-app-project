document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch('/api/users/settings', {
                method: 'PUT',
                body: formData,
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                throw new Error('Non-JSON response received');
            }

            if (response.ok) {
                alert('Settings updated successfully!');
                location.reload();
            } else {
                alert(result.message || 'Something went wrong.');
            }
        } catch (err) {
            alert('Failed to update settings.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('delete-account-button');

    deleteButton.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to delete your account?')) return;

        try {
            const userId = deleteButton.dataset.userid;

            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                
                window.location.href = '/login';
            } else {
                alert('Failed to delete account');
            }
        } catch (err) {
            console.error(err);
            alert('Error occurred while deleting account');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('password-modal');
    const openBtn = document.getElementById('change-password-btn');
    const closeBtn = document.getElementById('close-password-btn');
    const submitBtn = document.getElementById('submit-password-btn');
    const input = document.getElementById('new-password-input');

    openBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        input.value = '';
    });

    submitBtn.addEventListener('click', async () => {
        const password = input.value.trim();
        if (!password) return alert('Password cannot be empty.');

        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/users/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Password updated!');
                modal.classList.add('hidden');
                input.value = '';
            } else {
                alert(data.message || 'Failed to update password');
            }
        } catch (err) {
            alert('Error updating password');
        } finally {
            submitBtn.disabled = false;
        }
    });
});

