function parseUploadedFiles(files) {
    const media = [];

    for (const file of files) {
        const mimeType = file.mimetype;
        let mediaType = '';

        if (mimeType.startsWith('image/')) {
            mediaType = 'image';
        } else if (mimeType.startsWith('video/')) {
            mediaType = 'video';
        } else {
            throw new Error('Unsupported media type');
        }

        media.push({
            mediaUrl: `/uploads/posts/${file.filename}`,
            mediaType
        });
    }

    return media;
}

module.exports = { parseUploadedFiles };
