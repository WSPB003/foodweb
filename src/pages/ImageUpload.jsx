import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/images";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchGallery = async () => {
    try {
      const res = await axios.get(API_URL);
      setGallery(res.data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadedFile(null);
    setMessage("");
    setError("");
  };

  const onFileUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadedFile(res.data.file);
      setMessage("File uploaded successfully!");
      setError("");
      setFile(null); // Clear the input
      document.getElementById('file-input').value = ''; // Reset file input
      fetchGallery(); // Refresh gallery
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Error uploading file. See console for details.");
      setMessage("");
    }
  };

  const handleDelete = async (id, filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setMessage("File deleted successfully!");
            setError("");
            fetchGallery(); // Refresh gallery
        } catch (err) {
            console.error("Error deleting file:", err);
            setError("Error deleting file. See console for details.");
        }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Upload with GridFS</h1>

      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">Upload New Image</h2>
          <input type="file" id="file-input" className="file-input file-input-bordered w-full max-w-xs" onChange={onFileChange} />
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={onFileUpload} disabled={!file}>
              Upload
            </button>
          </div>
          {message && <p className="text-success mt-2">{message}</p>}
          {error && <p className="text-error mt-2">{error}</p>}
        </div>
      </div>

      {uploadedFile && (
        <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
                <h2 className="card-title">Last Uploaded Image</h2>
                <img
                    src={`${API_URL}/${uploadedFile.filename}`}
                    alt="Uploaded content"
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <p>Filename: {uploadedFile.filename}</p>
            </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Image Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gallery && gallery.length > 0 ? (
          gallery.map((img) => (
            <div key={img._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={`${API_URL}/${img.filename}`}
                  alt={img.filename}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body p-4">
                <p className="text-sm truncate" title={img.filename}>{img.filename}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-error btn-sm" onClick={() => handleDelete(img._id, img.filename)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No images in the gallery.</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
