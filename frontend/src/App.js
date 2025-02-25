import "./App.css";
import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedImageWatermarkUrl, setUploadedImageWatermarkUrl] =
    useState("");

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "watermark");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dpwugcpvq/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        setUploadedImageUrl(result.secure_url);
        setUploadedImageWatermarkUrl(result.secure_url + "?watermark=true");

        await saveImageToDB(
          result.secure_url,
          result.secure_url + "?watermark=true"
        );
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Something went wrong!");
    }
  };

  const saveImageToDB = async (imageUrl, watermarkUrl) => {
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: imageUrl, urlWatermark: watermarkUrl }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Image URL stored in database successfully!");
        console.log("Saved Data:", data);
      } else {
        alert("Failed to save image URL: " + data.error);
      }
    } catch (error) {
      console.log("Error saving image URL:", error);
      alert("Something went wrong while saving to DB!");
    }
  };

  return (
    <div className="App">
      <h1>Image Upload & Save</h1>

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadedImageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={uploadedImageUrl} alt="Uploaded" width="200" />
        </div>
      )}
    </div>
  );
}

export default App;
