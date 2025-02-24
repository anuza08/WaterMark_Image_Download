const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const Item = require("./models/item");
const cloudinary = require("./cloudinaryConfig");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const port = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.get("/images", async (req, res) => {
  try {
    const images = await Item.find({});
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in /images:", error);
  }
});

app.post("/upload-file", upload.single("image"), async (req, res) => {
  console.log("Request received at /upload-file");
  try {
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading file to Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "waterMark",
    });

    console.log("File uploaded to Cloudinary:", uploadResult.secure_url);

    const newItem = new Item({
      url: uploadResult.secure_url,
      urlWatermark: uploadResult.secure_url,
    });

    await newItem.save();
    console.log("Item saved to database");

    res.json({ imageUrl: uploadResult.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
