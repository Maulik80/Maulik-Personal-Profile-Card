import multer from 'multer';

// We use diskStorage to hold the file temporarily
const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;