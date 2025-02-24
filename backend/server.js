const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

// Serve static files
app.use("/output", express.static(path.join(__dirname, "output")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to upload and watermark an image
app.post("/upload-file", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Paths for uploaded files
    const imagePath = req.file.path;
    const outputPath = path.join(
      __dirname,
      "output",
      `watermarked_${req.file.originalname}`
    );

    // Load the watermark image (replace with your watermark path)
    const watermarkPath = path.join(__dirname, "watermark.png");
    const watermarkImage = await sharp(watermarkPath)
      .resize(200, 200) // Resize watermark to 200x200 pixels
      .toBuffer();

    // Composite the watermark onto the original image
    await sharp(imagePath)
      .composite([
        {
          input: watermarkImage,
          gravity: "south east", // Position watermark at the bottom-right corner
          blend: "over", // Blend mode
        },
      ])
      .toFile(outputPath);

    // Send the watermarked image URL in the response
    const watermarkedImageUrl = `/output/${path.basename(outputPath)}`;
    res.json({
      imageUrl: watermarkedImageUrl,
      message: "Image watermarked successfully",
    });
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
