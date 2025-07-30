function isValidISODate(dateString) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return isoDateRegex.test(dateString) && !isNaN(Date.parse(dateString));
}

module.exports = isValidISODate;
