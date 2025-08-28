document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('join-leave-btn');
    if (btn) {
        btn.addEventListener('click', async () => {
            const groupId = btn.dataset.groupId;
            const isMember = btn.dataset.isMember === 'true';
            const action = isMember ? 'leave' : 'join';

            const loadingToast = toast.loading(`${action === 'join' ? 'Joining' : 'Leaving'} group...`);
            setButtonLoading(btn, true);

            try {
                const res = await fetch(`/api/groups/${groupId}/${action}`, {
                    method: 'POST',
                    credentials: 'include'
                });

                if (res.ok) {
                    const newText = isMember ? 'Join Group' : 'Leave Group';
                    const newIsMember = !isMember;

                    btn.dataset.isMember = newIsMember.toString();
                    btn.setAttribute('data-original-text', newText);
                    btn.textContent = newText;

                    toast.update(loadingToast, `Successfully ${action}ed group!`, 'success');
                } else {
                    const data = await res.json();
                    toast.hide(loadingToast);
                    toast.error(data.error || `Failed to ${action} group`);
                }
            } catch (err) {
                console.error(`Group ${action} error:`, err);
                toast.hide(loadingToast);
                toast.error('Network error. Please try again.');
            } finally {
                setButtonLoading(btn, false);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const showBtn = document.getElementById('show-members-btn');
  const modal = document.getElementById('members-modal');
  const closeBtn = document.querySelector('.close-modal');

  if (showBtn && modal && closeBtn) {
    showBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
});

function attachEditHandler(icon) {
  icon.addEventListener("click", () => {
    const field = icon.dataset.editTarget;
    const container = icon.closest(`.editable-group-field`);

    const oldValue = container.childNodes[0].textContent.trim();
    const input = document.createElement("textarea");

    input.value = oldValue;
    input.className = "group-edit-input";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "glass-button small";

    container.innerHTML = "";
    container.appendChild(input);
    container.appendChild(saveBtn);

    saveBtn.addEventListener("click", async () => {
      const newValue = input.value.trim();
      if (newValue === oldValue || !newValue) {
        container.innerHTML = `
          ${oldValue}
          <i class="bi bi-pencil-square edit-icon" data-edit-target="${field}"></i>
        `;
        const newIcon = container.querySelector(".edit-icon");
        attachEditHandler(newIcon);
        return;
      }

      if (field === 'name' && newValue.length < 3) {
        toast.error('Group name must be at least 3 characters long');
        return;
      }

      if (field === 'name' && newValue.length > 50) {
        toast.error('Group name is too long. Maximum 50 characters allowed.');
        return;
      }

      if (field === 'description' && newValue.length > 200) {
        toast.error('Description is too long. Maximum 200 characters allowed.');
        return;
      }

      const loadingToast = toast.loading(`Updating ${field}...`);
      setButtonLoading(saveBtn, true);

      try {
        const groupId = document.getElementById("join-leave-btn").dataset.groupId;
        const res = await fetch(`/api/groups/${groupId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: newValue }),
          credentials: 'include'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Update failed');
        }

        container.innerHTML = `
          ${newValue}
          <i class="bi bi-pencil-square edit-icon" data-edit-target="${field}"></i>
        `;

        const newIcon = container.querySelector(".edit-icon");
        attachEditHandler(newIcon);
        toast.update(loadingToast, `Group ${field} updated successfully!`, 'success');

      } catch (err) {
        console.error('Group update error:', err);
        toast.hide(loadingToast);
        toast.error(err.message || 'Error updating group');

        container.innerHTML = `
          ${oldValue}
          <i class="bi bi-pencil-square edit-icon" data-edit-target="${field}"></i>
        `;
        const newIcon = container.querySelector(".edit-icon");
        attachEditHandler(newIcon);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".edit-icon").forEach(attachEditHandler);
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteBtn = document.getElementById('delete-group-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this group? This action cannot be undone.')) return;

      const groupId = document.getElementById("join-leave-btn").dataset.groupId;
      const loadingToast = toast.loading('Deleting group...');
      setButtonLoading(deleteBtn, true);

      try {
        const res = await fetch(`/api/groups/${groupId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to delete group');
        }

        toast.update(loadingToast, 'Group deleted successfully! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = '/my-groups';
        }, 1500);
      } catch (err) {
        console.error('Group deletion error:', err);
        toast.hide(loadingToast);
        toast.error(err.message || 'Error deleting group');
        setButtonLoading(deleteBtn, false);
      }
    });
  }
});

function setButtonLoading(button, isLoading) {
    if (!button) return;

    const originalText = button.getAttribute('data-original-text') || button.textContent;
    button.setAttribute('data-original-text', originalText);

    button.disabled = isLoading;
    button.textContent = isLoading ? 'Loading...' : originalText;
}
