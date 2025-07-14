const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';

        if (req.baseUrl.includes('/users') || file.fieldname === 'profileImage') {
            folder += 'profiles/';
        } else if (req.baseUrl.includes('/posts') || file.fieldname === 'media') {
            folder += 'posts/';
        } else {
            folder += 'misc/';
        }

        fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'video/mp4',
        'video/webm',
        'video/quicktime'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpg/png) and videos (mp4/webm/mov) are allowed'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
