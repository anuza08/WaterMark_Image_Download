const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/item"); // Ensure correct model import

const app = express();
app.use(cors()); 
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://anujashinde0803:U33EKz28qfKk17Tt@cluster0.efl3l.mongodb.net/testDb?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// API to store image URLs
app.post("/upload", async (req, res) => {
  try {
    const { url, urlWatermark } = req.body;

    if (!url || !urlWatermark) {
      return res
        .status(400)
        .json({ error: "Both URL and Watermark URL are required" });
    }

    const newItem = new Item({ url, urlWatermark });
    await newItem.save();

    res
      .status(201)
      .json({ message: "Image URL saved successfully", data: newItem });
  } catch (error) {
    console.error("Error saving image to DB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
