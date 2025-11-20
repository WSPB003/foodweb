const { GridFsStorage } = require("multer-gridfs-storage");
const multer = require("multer");

const mongoURI = "mongodb+srv://db_user_01:huRWTPn9rtfZFDZy@jib.bjdsdg3.mongodb.net/pos?retryWrites=true&w=majority";

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: "images", // Match the collection name
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

module.exports = { upload };
