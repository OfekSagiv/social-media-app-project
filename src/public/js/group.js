document.addEventListener('DOMContentLoaded', () => {

    const btn = document.getElementById('join-leave-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            const groupId = btn.dataset.groupId;
            const isMember = btn.dataset.isMember === 'true';
            const action = isMember ? 'leave' : 'join';

            try {
                const res = await fetch(`/api/groups/${groupId}/${action}`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (res.ok) {
                    btn.textContent = isMember ? 'Join Group' : 'Leave Group';
                    btn.dataset.isMember = (!isMember).toString();
                } else {
                    const data = await res.json();
                    alert(data.error || 'Error');
                }
            } catch (err) {
                alert('Network error');
            }
        });
    }
});
