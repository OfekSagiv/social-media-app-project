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
