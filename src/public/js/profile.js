document.addEventListener('DOMContentLoaded', () => {
    const followBtn = document.querySelector('.follow-btn');
    if (!followBtn) return;

    const userId = followBtn.dataset.userId;
    const followersCountEl = document.getElementById('followers-count');

    followBtn.addEventListener('click', async () => {
        try {
            const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                const isFollowing = data.following;
                followBtn.innerHTML = isFollowing
                    ? '<i class="bi bi-person-dash-fill"></i> Unfollow'
                    : '<i class="bi bi-person-plus-fill"></i> Follow';

                if (followersCountEl) {
                    let count = parseInt(followersCountEl.textContent);
                    followersCountEl.textContent = (isFollowing ? count + 1 : count - 1).toString();
                }
            } else {
                alert(data.error || 'Follow request failed');
            }
        } catch {
            alert('Failed to update follow status');
        }
    });
});
