document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connect-x-btn');
    const disconnectBtn = document.getElementById('disconnect-x-btn');

    if (connectBtn) {
        connectBtn.addEventListener('click', handleConnectToX);
    }

    if (disconnectBtn) {
        disconnectBtn.addEventListener('click', handleDisconnectFromX);
    }
});

async function handleConnectToX() {
    const connectBtn = document.getElementById('connect-x-btn');
    
    const loadingToast = toast.loading('Initiating X connection...');
    setButtonLoading(connectBtn, true);

    try {
        const response = await fetch('/api/auth/x/start?redirect=/x-auth', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.redirectUrl) {
            toast.update(loadingToast, 'Redirecting to X for authentication...', 'success');
            setTimeout(() => {
                window.location.href = result.redirectUrl;
            }, 1000);
        } else {
            throw new Error(result.error || 'Failed to start X authentication');
        }
    } catch (error) {
        console.error('X connect error:', error);
        toast.hide(loadingToast);
        toast.error('Failed to connect to X. Please try again.');
        setButtonLoading(connectBtn, false);
    }
}

async function handleDisconnectFromX() {
    const disconnectBtn = document.getElementById('disconnect-x-btn');
    
    if (!confirm('Are you sure you want to disconnect from X? You will no longer be able to share posts automatically.')) {
        return;
    }

    const loadingToast = toast.loading('Disconnecting from X...');
    setButtonLoading(disconnectBtn, true);
    
    try {
        const response = await fetch('/api/auth/x/disconnect', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            toast.update(loadingToast, 'Successfully disconnected from X!', 'success');
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            throw new Error(result.error || 'Failed to disconnect from X');
        }
    } catch (error) {
        console.error('X disconnect error:', error);
        toast.hide(loadingToast);
        toast.error('Failed to disconnect from X. Please try again.');
        setButtonLoading(disconnectBtn, false);
    }
}

function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalHtml = button.innerHTML;
        button.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> Loading...';
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalHtml || button.innerHTML;
        button.style.opacity = '1';
    }
}
