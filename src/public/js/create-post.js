function setButtonLoading(button, isLoading) {
    if (!button) return;

    const originalText = button.getAttribute('data-original-text') || button.textContent;
    button.setAttribute('data-original-text', originalText);

    button.disabled = isLoading;
    button.textContent = isLoading ? 'Creating Post...' : originalText;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('create-post-form');
    const fileInput = document.getElementById('media');
    const fileListDiv = document.getElementById('selected-files-list');
    const accumulatedFiles = [];

    if (!form || !fileInput) return;

    fileInput.addEventListener('change', () => {
        const newFiles = Array.from(fileInput.files);

        const placeholder = fileListDiv.querySelector('.placeholder');
        if (placeholder) placeholder.remove();

        newFiles.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                toast.warning(`File "${file.name}" is too large. Maximum size is 10MB.`);
                return;
            }

            accumulatedFiles.push(file);

            const fileElement = document.createElement('div');
            fileElement.className = 'selected-file';
            fileElement.innerHTML = `
                <span>${file.name}</span>
                <button type="button" class="remove-file-btn" data-file-name="${file.name}">Remove</button>
            `;
            fileListDiv.appendChild(fileElement);
        });

        fileInput.value = '';
    });

    fileListDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-file-btn')) {
            const fileName = e.target.getAttribute('data-file-name');
            const fileIndex = accumulatedFiles.findIndex(file => file.name === fileName);

            if (fileIndex > -1) {
                accumulatedFiles.splice(fileIndex, 1);
                e.target.closest('.selected-file').remove();

                if (accumulatedFiles.length === 0 && !fileListDiv.querySelector('.placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'placeholder';
                    placeholder.textContent = 'No files selected';
                    fileListDiv.appendChild(placeholder);
                }
            }
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const content = form.querySelector('[name="content"]').value.trim();
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!content && accumulatedFiles.length === 0) {
            toast.warning('Please add some content or media to your post.');
            return;
        }

        if (content.length > 500) {
            toast.warning('Post content is too long. Maximum 500 characters allowed.');
            return;
        }

        const loadingToast = toast.loading('Creating post...');
        setButtonLoading(submitBtn, true);

        const formData = new FormData(form);

        const pathParts = window.location.pathname.split('/');
        if (pathParts[1] === 'group') {
            formData.append('groupId', pathParts[2]);
        }

        accumulatedFiles.forEach(file => {
            formData.append('media', file);
        });

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const contentType = res.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await res.json();
            } else {
                throw new Error('Invalid response format received');
            }

            if (res.ok) {
                toast.update(loadingToast, 'Post created successfully! Refreshing page...', 'success');
                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                toast.hide(loadingToast);
                toast.error(result.message || 'Failed to create post. Please try again.');
            }
        } catch (err) {
            console.error('Create post error:', err);
            toast.hide(loadingToast);
            toast.error('Network error. Please check your connection and try again.');
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });

    const xCheckbox = document.getElementById('shareToX');
    const xContainer = document.querySelector('.share-x-container');

    if (xCheckbox && xContainer) {
        xCheckbox.addEventListener('change', function() {
            if (this.checked) {
                xContainer.style.borderColor = '#1da1f2';
                xContainer.style.boxShadow = '0 4px 12px rgba(29, 161, 242, 0.15)';

                xContainer.style.animation = 'xCheckPulse 0.3s ease-out';
                setTimeout(() => {
                    xContainer.style.animation = '';
                }, 300);
            } else {
                xContainer.style.borderColor = '#e1e8f0';
                xContainer.style.boxShadow = '';
            }
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes xCheckPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});
