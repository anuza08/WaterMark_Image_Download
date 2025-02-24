import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [image, setImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image!");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch("http://localhost:3000/upload-file", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadedImageUrl(result.imageUrl);
        alert("Image uploaded successfully!");
      } else {
        alert("Upload failed: " + result.message);
      }
    } catch (error) {
      console.log("Error uploading image:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="App">
      <h1>Image Upload to Cloudinary</h1>

      <h2>Stored Images:</h2>
      {data.map((item, index) => (
        <img key={index} src={item.url} alt={`img-${index}`} width="150" />
      ))}

      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>

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
