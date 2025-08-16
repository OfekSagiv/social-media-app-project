function setButtonLoading(button, isLoading, originalText = null) {
    if (!button) return;

    button.disabled = isLoading;
}

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
            const isHidden = commentSection.style.display === 'none';
            commentSection.style.display = isHidden ? 'block' : 'none';
            commentToggleBtn.textContent = isHidden ? 'Hide Comments' : 'Show Comments';
        });

        likeBtn?.addEventListener('click', async () => {

            if (likeBtn.disabled) return;
            likeBtn.disabled = true;

            try {
                const res = await fetch(`/api/posts/${postId}/like`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`Failed to like post: ${res.status}`);
                }

                const data = await res.json();
                likeCountEl.textContent = data.likes;
            } catch (err) {
                console.error('Error liking post:', err);
            } finally {
                likeBtn.disabled = false;
            }
        });

        deletePostBtn?.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                return;
            }

            const loadingToast = toast.loading('Deleting post...');
            setButtonLoading(deletePostBtn, true);

            try {
                const res = await fetch(`/api/posts/${postId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`Failed to delete post: ${res.status}`);
                }

                toast.update(loadingToast, 'Post deleted successfully!', 'success');
                postEl.remove();
            } catch (err) {
                console.error('Error deleting post:', err);
                toast.hide(loadingToast);
                toast.error('Failed to delete post. Please try again.');
                setButtonLoading(deletePostBtn, false);
            }
        });

        commentForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = commentInput.value.trim();

            if (!text) {
                toast.warning('Please enter a comment');
                return;
            }

            const submitBtn = commentForm.querySelector('button[type="submit"]');
            const loadingToast = toast.loading('Adding comment...');
            setButtonLoading(submitBtn, true);

            try {
                const res = await fetch(`/api/posts/${postId}/comments`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({text}),
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`Failed to add comment: ${res.status}`);
                }

                const data = await res.json();

                const li = document.createElement('li');
                li.className = 'comment-item';
                li.innerHTML = `<strong>${data.authorName}:</strong> ${data.text}`;
                commentList.appendChild(li);

                commentInput.value = '';
                commentCountEl.textContent = (parseInt(commentCountEl.textContent) + 1).toString();
                toast.update(loadingToast, 'Comment added successfully!', 'success');
            } catch (err) {
                console.error('Error adding comment:', err);
                toast.hide(loadingToast);
                toast.error('Failed to add comment. Please try again.');
            } finally {
                setButtonLoading(submitBtn, false);
            }
        });

        postEl.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!confirm('Are you sure you want to delete this comment?')) {
                    return;
                }

                const createdAt = btn.dataset.createdAt;
                const loadingToast = toast.loading('Deleting comment...');
                setButtonLoading(btn, true);

                try {
                    const res = await fetch(`/api/posts/${postId}/comments`, {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({createdAt}),
                        credentials: 'include'
                    });

                    if (!res.ok) {
                        throw new Error(`Failed to delete comment: ${res.status}`);
                    }

                    btn.closest('li').remove();
                    commentCountEl.textContent = (parseInt(commentCountEl.textContent) - 1).toString();
                    toast.update(loadingToast, 'Comment deleted successfully!', 'success');
                } catch (err) {
                    console.error('Error deleting comment:', err);
                    toast.hide(loadingToast);
                    toast.error('Failed to delete comment. Please try again.');
                    setButtonLoading(btn, false);
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.edit-post-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postCard = btn.closest('.post-card');
            const postId = postCard.dataset.postId;
            const textEl = postCard.querySelector('.post-text');
            const textarea = postCard.querySelector('.edit-post-textarea');
            const saveBtn = postCard.querySelector('.save-post-btn');
            const cancelBtn = postCard.querySelector('.cancel-edit-btn');

            textarea.classList.remove('hidden');
            saveBtn.classList.remove('hidden');
            if (cancelBtn) cancelBtn.classList.remove('hidden');
            textEl.classList.add('hidden');
            btn.classList.add('hidden');

            const handleSave = async () => {
                const newText = textarea.value.trim();

                if (!newText) {
                    showNotification('Post content cannot be empty', 'warning');
                    return;
                }

                setButtonLoading(saveBtn, true);

                try {
                    const res = await fetch(`/api/posts/${postId}`, {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({content: newText}),
                        credentials: 'include'
                    });

                    if (!res.ok) {
                        throw new Error(`Failed to update post: ${res.status}`);
                    }

                    textEl.textContent = newText;
                    exitEditMode();
                    showNotification('Post updated successfully!', 'success');
                } catch (err) {
                    console.error('Error updating post:', err);
                    showNotification('Failed to update post. Please try again.', 'error');
                } finally {
                    setButtonLoading(saveBtn, false);
                }
            };

            const handleCancel = () => {
                textarea.value = textEl.textContent;
                exitEditMode();
            };

            const exitEditMode = () => {
                textarea.classList.add('hidden');
                saveBtn.classList.add('hidden');
                if (cancelBtn) cancelBtn.classList.add('hidden');
                textEl.classList.remove('hidden');
                btn.classList.remove('hidden');
            };

            saveBtn.addEventListener('click', handleSave, { once: true });
            if (cancelBtn) {
                cancelBtn.addEventListener('click', handleCancel, { once: true });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.post-text').forEach(textEl => {
    const lineHeight = parseFloat(getComputedStyle(textEl).lineHeight);
    const textHeight = textEl.scrollHeight;

    if (textHeight > lineHeight * 3) {
      textEl.classList.add('multi-column');
    }
  });
});
