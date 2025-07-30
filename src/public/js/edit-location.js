document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-location-form');
    const input = form?.querySelector('input[name="address"]');
    const feedback = document.getElementById('location-feedback');
    const deleteBtn = document.getElementById('delete-location-btn');

    if (!form || !input || !feedback) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const address = input.value.trim();
        feedback.textContent = '';

        if (!address) {
            feedback.textContent = 'Address is required.';
            feedback.classList.remove('success');
            feedback.classList.add('error');
            return;
        }

        try {
            const res = await fetch('/api/location/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ address }),
                credentials: 'include'
            });

            const result = await res.json();

            if (res.ok) {
                feedback.textContent = 'Location saved successfully.';
                feedback.classList.remove('error');
                feedback.classList.add('success');
            } else {
                feedback.textContent = result.error || 'Failed to save location.';
                feedback.classList.remove('success');
                feedback.classList.add('error');
            }
        } catch (err) {
            feedback.textContent = 'Something went wrong.';
            feedback.classList.remove('success');
            feedback.classList.add('error');
        }
    });

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            feedback.textContent = '';

            try {
                const res = await fetch('/api/location/delete', {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const result = await res.json();

                if (res.ok) {
                    feedback.textContent = 'Location deleted.';
                    feedback.classList.remove('error');
                    feedback.classList.add('success');
                    input.value = '';
                } else {
                    feedback.textContent = result.error || 'Failed to delete location.';
                    feedback.classList.remove('success');
                    feedback.classList.add('error');
                }
            } catch (err) {
                feedback.textContent = 'Something went wrong.';
                feedback.classList.remove('success');
                feedback.classList.add('error');
            }
        });
    }
});
