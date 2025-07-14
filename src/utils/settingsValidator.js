const buildValidatedUpdateData = (body, file) => {
    const {
        fullName,
        bio,
        website,
        dateOfBirth,
    } = body;

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;

    if (website) {
        const validUrl = /^https?:\/\/.+/i.test(website);
        if (!validUrl) throw new Error('Invalid website URL');
        updateData.website = website;
    }

    if (dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        const isValidDate = !isNaN(parsedDate.getTime()) && parsedDate.getFullYear() > 1900 && parsedDate < new Date();
        if (isValidDate) {
            updateData.dateOfBirth = parsedDate;
        } else {
            throw new Error('Invalid date of birth');
        }
    }

    if (file) {
        updateData.profileImageUrl = `/uploads/profiles/${file.filename}`;
    }

    return updateData;
};

module.exports = {
    buildValidatedUpdateData
};
