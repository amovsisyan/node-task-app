const multer = require('multer');

const uploader = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            callback(new Error('Incorrect file extension.'))
        }

        callback(undefined, true)
    }
});

module.exports = uploader;