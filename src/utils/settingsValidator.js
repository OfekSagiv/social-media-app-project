const buildValidatedUpdateData = (body, file) => {
    const {
        fullName,
        bio,
        website,
        dateOfBirth,
        canBeFollowedBy,
        canBeCommentedBy,
    } = body;

    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;

    if (website) {
        const validUrl = /^https?:\/\/.+/i.test(website);
        if (!validUrl) throw new Error('Invalid website URL');
        updateData.website = website;
    }

    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (canBeFollowedBy) updateData.canBeFollowedBy = canBeFollowedBy;
    if (canBeCommentedBy) updateData.canBeCommentedBy = canBeCommentedBy;

    if (file) {
        updateData.profileImageUrl = `/uploads/profiles/${file.filename}`;
    }

    return updateData;
};

module.exports = {
    buildValidatedUpdateData
};
