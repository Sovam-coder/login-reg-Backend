const express = require('express');
const multer = require('multer');
const path = require('path');

const { registerUser, loginUser } = require('../controllers/user.controller');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(req, file, cb) {

    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Invalid image format'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(req, file, cb);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// Register a new user
router.post('/register', upload.single('profilePic'), registerUser);

router.post('/login', loginUser);

module.exports = router;