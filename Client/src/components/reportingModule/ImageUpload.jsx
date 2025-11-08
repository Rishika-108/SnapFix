import React, { useRef } from "react";

const ImageUpload = ({ image, previewImage, handleImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleImageUpload(file);
  };

  return (
    <div className="text-center">
      <label className="block text-gray-300 mb-2">Capture Image</label>
      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-gray-500 rounded-xl p-4 cursor-pointer hover:border-indigo-400 transition"
      >
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <p className="text-gray-400">Click to capture or upload image</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
