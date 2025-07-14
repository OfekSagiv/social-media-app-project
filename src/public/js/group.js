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


      try {
        const groupId = document.getElementById("join-leave-btn").dataset.groupId;
        const res = await fetch(`/api/groups/${groupId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: newValue }),
        });

        if (!res.ok) throw new Error("Update failed");

        container.innerHTML = `
          ${newValue}
          <i class="bi bi-pencil-square edit-icon" data-edit-target="${field}"></i>
        `;

        const newIcon = container.querySelector(".edit-icon");
        attachEditHandler(newIcon);

      } catch (err) {
        alert("Error updating group");
        console.error(err);
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
      if (!confirm('Are you sure you want to delete this group?')) return;

      const groupId = document.getElementById("join-leave-btn").dataset.groupId;
      try {
        const res = await fetch(`/api/groups/${groupId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete group');

        window.location.href = '/my-groups';
      } catch (err) {
        alert('Error deleting group');
        console.error(err);
      }
    });
  }
});
