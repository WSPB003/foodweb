const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { upload } = require("../middleware/storage.cjs");

let gfs;
mongoose.connection.once("open", () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
});

// @route   POST /
// @desc    Upload a single image
router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(201).json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

// @route   GET /
// @desc    Get all image files
router.get("/", async (req, res) => {
  try {
    const files = await gfs.find().toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ err: "No files exist" });
    }
    return res.json(files);
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// @route   GET /:filename
// @desc    Display a single image
router.get("/:filename", async (req, res) => {
  try {
    const files = await gfs.find({ filename: req.params.filename }).toArray();
    if (!files[0] || files.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // Check if image
    if (
      files[0].contentType === "image/jpeg" ||
      files[0].contentType === "image/png" ||
      files[0].contentType === "image/webp" ||
      files[0].contentType === "image/gif"
    ) {
      const readStream = gfs.openDownloadStreamByName(req.params.filename);
      readStream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
  }
});

// @route   DELETE /:id
// @desc    Delete an image
router.delete("/:id", async (req, res) => {
    try {
        const obj_id = new mongoose.Types.ObjectId(req.params.id);
        await gfs.delete(obj_id);
        res.status(200).json({ message: "File deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: "An error occurred while deleting the file." });
    }
});


module.exports = router;
