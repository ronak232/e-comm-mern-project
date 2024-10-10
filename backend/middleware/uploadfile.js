import multer from "multer";

const storeImages = new multer.memoryStorage({
  dest: "uploads/",
});

// upload image instance...
const imageUpload = multer({
  storage: storeImages,
});

export { imageUpload };
