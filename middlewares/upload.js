const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { fileTypeFromFile } = require("file-type");

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
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  },
});

const allowedTypes = {
  avatar: {
    mimeTypes: ["image/jpeg", "image/png"],
    extensions: [".jpg", ".jpeg", ".png"],
  },
  file: {
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    extensions: [".jpg", ".jpeg", ".png", ".pdf"],
  },
};

const fileFilter = (req, file, cb) => {
  const rules = allowedTypes[file.fieldname];

  if (!rules) {
    return cb(new Error("Unexpected field"));
  }

  const lowerName = file.originalname.toLowerCase();

  const endsWithAllowedExt = rules.extensions.some((ext) =>
    lowerName.endsWith(ext),
  );
  const mimeOk = rules.mimeTypes.includes(file.mimetype);

  if (endsWithAllowedExt && mimeOk) {
    cb(null, true);
  } else if (file.fieldname === "avatar") {
    cb(new Error("Only JPG, JPEG, PNG allowed for avatar"));
  } else {
    cb(new Error("Only JPG, JPEG, PNG, PDF allowed"));
  }
};

const verifyFileContent = async (filePath, fieldName) => {
  const rules = allowedTypes[fieldName];
  const type = await fileTypeFromFile(filePath);

  if (!type || !rules.mimeTypes.includes(type.mime)) {
    return false;
  }

  return true;
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
    upload(req, res, async (err) => {
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

      if (!req.file) {
        return next();
      }

      try {
        const isValidContent = await verifyFileContent(
          req.file.path,
          fieldName,
        );

        if (!isValidContent) {
          fs.unlink(req.file.path, () => {});

          return res.status(400).json({
            result: false,
            message: "File content does not match an allowed file type",
          });
        }

        next();
      } catch (e) {
        fs.unlink(req.file.path, () => {});
        return res.status(500).json({
          result: false,
          message: "Error validating file",
        });
      }
    });
  };
};

module.exports = {
  uploadAvatar: uploadSingle("avatar", 2),
  uploadSubmission: uploadSingle("file", 5),
};
