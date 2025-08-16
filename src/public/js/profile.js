function setButtonLoading(button, isLoading) {
    if (!button) return;

    const originalText = button.getAttribute('data-original-text') || button.innerHTML;
    button.setAttribute('data-original-text', originalText);

    button.disabled = isLoading;
    if (isLoading) {
        button.innerHTML = '<i class="bi bi-hourglass-split"></i> Loading...';
    } else {
        button.innerHTML = originalText;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelector('.follow-btn');
    if (!followBtn) return;

    const userId = followBtn.dataset.userId;
    const followersCountEl = document.getElementById('followers-count');

    followBtn.addEventListener('click', async () => {
        const loadingToast = toast.loading('Updating follow status...');
        setButtonLoading(followBtn, true);

        try {
            const res = await fetch(`/api/users/${userId}/follow`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await res.json();

            if (res.ok) {
                const isFollowing = data.action === 'followed';

                followBtn.innerHTML = isFollowing
                    ? '<i class="bi bi-person-dash-fill"></i> Unfollow'
                    : '<i class="bi bi-person-plus-fill"></i> Follow';

                if (followersCountEl) {
                    let count = parseInt(followersCountEl.textContent);
                    count = isFollowing ? count + 1 : Math.max(count - 1, 0);
                    followersCountEl.textContent = count.toString();
                }

                toast.update(
                    loadingToast,
                    isFollowing ? 'Successfully followed user!' : 'Successfully unfollowed user!',
                    'success'
                );
            } else {
                toast.hide(loadingToast);
                toast.error(data.error || 'Follow request failed');
            }
        } catch (err) {
            console.error('Follow operation error:', err);
            toast.hide(loadingToast);
            toast.error('Network error. Please try again.');
        } finally {
            setButtonLoading(followBtn, false);
        }
    });
});
