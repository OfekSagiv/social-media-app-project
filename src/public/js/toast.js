class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', options = {}) {
        const {
            duration = type === 'loading' ? 0 : 4000,
            closeable = true,
            id = null,
            persistent = false
        } = options;

        const toastId = id || 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        if (this.toasts.has(toastId)) {
            this.hide(toastId);
        }

        const toast = this.createToast(message, type, duration, closeable, toastId, persistent);
        this.container.appendChild(toast);
        this.toasts.set(toastId, { element: toast, type, persistent });

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        if (duration > 0 && !persistent) {
            setTimeout(() => {
                this.hide(toastId);
            }, duration);
        }

        return toastId;
    }

    createToast(message, type, duration, closeable, id, persistent) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.setAttribute('data-toast-id', id);

        const icon = this.getIcon(type);
        const closeButton = closeable ? '<button class="toast-close" type="button">&times;</button>' : '';
        const progress = duration > 0 && !persistent ? `<div class="toast-progress" style="--duration: ${duration}ms"></div>` : '';

        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">${message}</div>
            ${closeButton}
            ${progress}
        `;

        if (closeable) {
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.hide(id));
        }

        return toast;
    }

    getIcon(type) {
        const icons = {
            success: '<i class="bi bi-check-circle-fill"></i>',
            error: '<i class="bi bi-x-circle-fill"></i>',
            warning: '<i class="bi bi-exclamation-triangle-fill"></i>',
            info: '<i class="bi bi-info-circle-fill"></i>',
            loading: '<div class="loading-spinner"></div>'
        };
        return icons[type] || icons.info;
    }

    hide(toastId) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) return;

        const { element } = toastData;
        element.classList.remove('show');
        element.classList.add('hide');

        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            this.toasts.delete(toastId);
        }, 400);
    }

    hideAll() {
        this.toasts.forEach((_, id) => this.hide(id));
    }

    update(toastId, message, type = null) {
        const toastData = this.toasts.get(toastId);
        if (!toastData) return;

        const { element } = toastData;
        const contentEl = element.querySelector('.toast-content');
        const iconEl = element.querySelector('.toast-icon');

        if (contentEl) {
            contentEl.textContent = message;
        }

        if (type && type !== toastData.type) {
            element.className = `toast ${type} show`;
            iconEl.innerHTML = this.getIcon(type);
            toastData.type = type;
        }
    }

    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { duration: 6000, ...options });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', { duration: 5000, ...options });
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    loading(message, options = {}) {
        return this.show(message, 'loading', { duration: 0, closeable: false, ...options });
    }

    async promise(promise, messages = {}) {
        const {
            loading = 'Loading...',
            success = 'Success!',
            error = 'Error occurred'
        } = messages;

        const loadingId = this.loading(loading);

        try {
            const result = await promise;
            this.hide(loadingId);
            this.success(success);
            return result;
        } catch (err) {
            this.hide(loadingId);
            this.error(typeof error === 'function' ? error(err) : error);
            throw err;
        }
    }
}

const toast = new ToastManager();

function showNotification(message, type = 'info', options = {}) {
    return toast.show(message, type, options);
}

function showToast(message, type = 'info', options = {}) {
    return toast.show(message, type, options);
}

window.toast = toast;
window.showNotification = showNotification;
window.showToast = showToast;
