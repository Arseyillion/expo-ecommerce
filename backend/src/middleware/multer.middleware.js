import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

// fileFilter is used to filter the files based on their mimetype
const fileFilter = (req, file, cb) => {
  // cb stands for callback
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg,jpg,png,webp)"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}); 