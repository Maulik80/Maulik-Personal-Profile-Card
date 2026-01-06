/* Server/middleware/multer.js */
import multer from 'multer';
import path from 'path';

// Storage Configuration
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        // ✅ Fix: Use unique filename (Timestamp + Random)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter (Only Images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // ✅ Limit: 5MB
});

export default upload;