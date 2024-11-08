import multer from "multer";
import path from "path";

// Set storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cover_letters/"); // Folder to store uploaded cover letters
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    // Set a unique name for the file
    cb(null, `${Date.now()}${ext}`);
  },
});

// File filter to accept only PDF files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".pdf") {
    return cb(new Error("Only PDF files are allowed"), false);
  }
  cb(null, true);
};

// Set multer options
const upload = multer({ storage, fileFilter });

export default upload;
