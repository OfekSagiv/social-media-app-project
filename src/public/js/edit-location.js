document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-location-form');
    const input = form?.querySelector('input[name="address"]');
    const feedback = document.getElementById('location-feedback');
    const deleteBtn = document.getElementById('delete-location-btn');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !input || !feedback) return;

    const setLoading = (isLoading) => {
        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.textContent = isLoading ? 'Saving...' : 'Save Location';
        }
        if (deleteBtn) {
            deleteBtn.disabled = isLoading;
        }
    };

    input.addEventListener('input', () => {
        const value = input.value.trim();
        feedback.textContent = '';
        feedback.className = '';

        if (value.length > 0 && value.length < 5) {
            feedback.textContent = 'Please enter a more detailed address';
            feedback.classList.add('warning');
        } else if (value.length > 200) {
            feedback.textContent = 'Address is too long';
            feedback.classList.add('error');
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const address = input.value.trim();
        feedback.textContent = '';
        feedback.className = '';

        if (!address) {
            feedback.textContent = 'Address is required.';
            feedback.classList.add('error');
            return;
        }

        if (address.length < 5) {
            feedback.textContent = 'Please enter a more detailed address.';
            feedback.classList.add('error');
            return;
        }

        if (address.length > 200) {
            feedback.textContent = 'Address is too long.';
            feedback.classList.add('error');
            return;
        }

        setLoading(true);

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
                feedback.textContent = result.city ?
                    `Location saved successfully in ${result.city}` :
                    'Location saved successfully';
                feedback.classList.add('success');

                const currentDisplay = document.querySelector('.current-location-display p');
                if (currentDisplay) {
                    currentDisplay.textContent = address;
                }
            } else {
                feedback.textContent = result.error || 'Failed to save location.';
                feedback.classList.add('error');
            }
        } catch (err) {
            console.error('Location save error:', err);
            feedback.textContent = 'Network error. Please check your connection and try again.';
            feedback.classList.add('error');
        } finally {
            setLoading(false);
        }
    });

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete your location?')) {
                return;
            }

            feedback.textContent = '';
            feedback.className = '';
            setLoading(true);

            try {
                const res = await fetch('/api/location/delete', {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const result = await res.json();

                if (res.ok) {
                    feedback.textContent = 'Location deleted successfully.';
                    feedback.classList.add('success');
                    input.value = '';


                    const currentDisplay = document.querySelector('.current-location-display p');
                    if (currentDisplay) {
                        currentDisplay.textContent = 'No address set';
                    }
                } else {
                    feedback.textContent = result.error || 'Failed to delete location.';
                    feedback.classList.add('error');
                }
            } catch (err) {
                console.error('Location delete error:', err);
                feedback.textContent = 'Network error. Please try again.';
                feedback.classList.add('error');
            } finally {
                setLoading(false);
            }
        });
    }
});
