function sanitizeString(val) {
    if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    return null;
}

function sanitizeNumber(val) {
    const num = Number(val);
    return isNaN(num) ? null : num;
}

function sanitizeDate(val) {
    const date = new Date(val);
    return isNaN(date.getTime()) ? null : date;
}

module.exports = {
    sanitizeString,
    sanitizeNumber,
    sanitizeDate
};
