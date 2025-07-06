document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.post-card').forEach(postEl => {
        const postId = postEl.dataset.postId;

        const likeBtn = postEl.querySelector('.like-btn');
        const likeCountEl = postEl.querySelector('.like-count');
        const deletePostBtn = postEl.querySelector('.delete-post-btn');
        const commentToggleBtn = postEl.querySelector('.comment-toggle-btn');
        const commentSection = postEl.querySelector('.post-comments');
        const commentForm = postEl.querySelector('.comment-form');
        const commentInput = postEl.querySelector('.comment-input');
        const commentList = postEl.querySelector('.comment-list');
        const commentCountEl = postEl.querySelector('.comment-count');

        commentToggleBtn?.addEventListener('click', () => {
            commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
        });

        likeBtn?.addEventListener('click', async () => {
            try {
                const res = await fetch(`/api/posts/${postId}/like`, {method: 'POST'});
                const data = await res.json();
                if (res.ok) {
                    likeCountEl.textContent = data.likes;
                }
            } catch {
                alert('Error liking post');
            }
        });

        deletePostBtn?.addEventListener('click', async () => {
            if (!confirm('are you sure?')) return;
            try {
                const res = await fetch(`/api/posts/${postId}`, {method: 'DELETE'});
                if (res.ok) postEl.remove();
            } catch {
                alert('Error deleting post');
            }
        });

        commentForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();
            if (!text) return;

            try {
                const res = await fetch(`/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({text}),
                });
                const data = await res.json();
                if (res.ok) {
                    const li = document.createElement('li');
                    li.className = 'comment-item';
                    li.innerHTML = `<strong>${data.authorName}:</strong> ${data.text}`;
                    commentList.appendChild(li);
                    commentInput.value = '';
                    commentCountEl.textContent = (parseInt(commentCountEl.textContent) + 1).toString();
                }
            } catch {
                alert('Error adding comment');
            }
        });

        postEl.querySelectorAll('.delete-comment-btn')?.forEach(btn => {
            btn.addEventListener('click', async () => {
                const createdAt = btn.dataset.createdAt;
                try {
                    const res = await fetch(`/api/posts/${postId}/comments`, {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({createdAt}),
                    });
                    if (res.ok) {
                        btn.closest('li').remove();
                        commentCountEl.textContent = (parseInt(commentCountEl.textContent) - 1).toString();
                    }
                } catch {
                    alert('Error deleting comment');
                }
            });
        });
    });
});
