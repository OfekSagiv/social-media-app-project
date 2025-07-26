function sanitize(val) {
    if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    return null;
}

module.exports = sanitize;
