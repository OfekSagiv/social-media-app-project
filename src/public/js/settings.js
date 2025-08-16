document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');

        const fullName = formData.get('fullName')?.trim();

        if (!fullName) {
            toast.error('Please fill in all required fields');
            return;
        }

        const loadingToast = toast.loading('Updating settings...');
        setButtonLoading(submitBtn, true);

        try {
            const response = await fetch('/api/users/settings', {
                method: 'PUT',
                body: formData,
                credentials: 'include'
            });

            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                throw new Error('Invalid response format received');
            }

            if (response.ok) {
                toast.update(loadingToast, 'Settings updated successfully! Page will reload in 2 seconds.', 'success');
                setTimeout(() => {
                    location.reload();
                }, 2000);
            } else {
                toast.hide(loadingToast);
                toast.error(result.message || 'Failed to update settings. Please try again.');
            }
        } catch (err) {
            console.error('Settings update error:', err);
            toast.hide(loadingToast);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.getElementById('delete-account-button');

    if (!deleteButton) return;

    deleteButton.addEventListener('click', async () => {
        const confirmText = 'DELETE';
        const userInput = prompt(`This action will permanently delete your account and all your data.\n\nType "${confirmText}" to confirm deletion:`);

        if (userInput !== confirmText) {
            toast.info('Account deletion cancelled.');
            return;
        }

        const loadingToast = toast.loading('Deleting account...');
        setButtonLoading(deleteButton, true);

        try {
            const userId = deleteButton.dataset.userid;

            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                toast.update(loadingToast, 'Account deleted successfully. Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                const result = await response.json();
                toast.hide(loadingToast);
                toast.error(result.message || 'Failed to delete account. Please try again.');
            }
        } catch (err) {
            console.error('Account deletion error:', err);
            toast.hide(loadingToast);
            toast.error('Network error. Please try again.');
        } finally {
            setButtonLoading(deleteButton, false);
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
        if (!password) {
            toast.error('Password cannot be empty.');
            return;
        }

        const loadingToast = toast.loading('Updating password...');
        setButtonLoading(submitBtn, true);

        try {
            const res = await fetch('/api/users/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.update(loadingToast, 'Password updated successfully!', 'success');
                modal.classList.add('hidden');
                input.value = '';
            } else {
                toast.hide(loadingToast);
                toast.error(data.message || 'Failed to update password');
            }
        } catch (err) {
            console.error('Password update error:', err);
            toast.hide(loadingToast);
            toast.error('Network error. Please try again.');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
});

function setButtonLoading(button, isLoading) {
    if (!button) return;

    const originalText = button.getAttribute('data-original-text') || button.textContent;
    button.setAttribute('data-original-text', originalText);

    button.disabled = isLoading;
    button.textContent = isLoading ? 'Saving...' : originalText;
}
