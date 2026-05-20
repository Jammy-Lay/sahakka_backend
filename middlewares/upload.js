const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "avatar") {
            cb(null, "uploads/avatars/");
        } else {
            cb(null, "uploads/submissions/");
        }
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, PDF allowed"));
    }
};

const uploadSingle = (fieldName, maxSizeMB) => {
    const upload = multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSizeMB * 1024 * 1024,
        },
    }).single(fieldName);

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        result: false,
                        message: `File too large (max ${maxSizeMB}MB)`,
                    });
                }

                return res.status(400).json({
                    result: false,
                    message: err.message,
                });
            }

            next();
        });
    };
};

module.exports = {
    uploadAvatar: uploadSingle("avatar", 2),
    uploadSubmission: uploadSingle("file", 5),
};