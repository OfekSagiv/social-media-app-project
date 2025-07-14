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
