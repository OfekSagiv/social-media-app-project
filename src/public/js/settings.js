document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // הדפסת תוכן הטופס ללוג
        console.log('📤 Sending form data:');
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`🖼️ ${key}: [File] ${value.name}`);
            } else {
                console.log(`📝 ${key}: ${value}`);
            }
        }

        try {
            const response = await fetch('/api/users/settings', {
                method: 'PUT',
                body: formData,
            });

            console.log('📥 Response status:', response.status);

            const contentType = response.headers.get('content-type');
            console.log('📄 Content-Type:', contentType);

            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
                console.log('✅ JSON result:', result);
            } else {
                const text = await response.text();
                console.warn('⚠️ Received non-JSON response:', text);
                throw new Error('Non-JSON response received');
            }

            if (response.ok) {
                alert('Settings updated successfully!');
                location.reload();
            } else {
                alert(result.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error('❌ Error submitting settings:', err);
            alert('Failed to update settings.');
        }
    });
});
