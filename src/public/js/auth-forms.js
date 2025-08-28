document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
});

function setButtonLoading(button, isLoading) {
    if (!button) return;
    button.disabled = isLoading;

}

async function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
    }

    const loadingToast = toast.loading('Logging in...');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await res.json();

        if (!res.ok) {
            toast.hide(loadingToast);
            toast.error(data.error || 'Login failed');
            submitBtn.disabled = false;
            return;
        }

        toast.hide(loadingToast);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000);
    } catch (err) {
        console.error('Login error:', err);
        toast.hide(loadingToast);
        toast.error('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const form = e.target;
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        toast.error('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        toast.warning('Password must be at least 6 characters long');
        return;
    }

    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }

    const loadingToast = toast.loading('Creating account...');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password }),
            credentials: 'include'
        });

        const data = await res.json();

        if (!res.ok) {
            toast.hide(loadingToast);
            toast.error(data.error || 'Signup failed');
            submitBtn.disabled = false;
            return;
        }

        toast.hide(loadingToast);
        toast.success('Account created successfully! Redirecting...');
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000);
    } catch (err) {
        console.error('Signup error:', err);
        toast.hide(loadingToast);
        toast.error('Network error. Please check your connection and try again.');
        submitBtn.disabled = false;
    }
}
