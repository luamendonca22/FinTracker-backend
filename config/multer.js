const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storageDir = path.join(__dirname, "../uploads");

// Create the directory if it doesn't exist
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const storageDir = path.join(__dirname, "../uploads");

    // Create the directory if it doesn't exist
    if (!fs.existsSync(storageDir)) {
      try {
        await fs.promises.mkdir(storageDir, { recursive: true });
      } catch (error) {
        console.error("Error creating directory:", error);
      }
    }

    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("file");
module.exports = upload;
