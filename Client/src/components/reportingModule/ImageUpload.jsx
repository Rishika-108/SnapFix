import React, { useRef } from "react";
import { compressImage } from "../../utils/imageCompressor";

const ImageUpload = ({ image, previewImage, handleImageUpload }) => {
  const fileInputRef = useRef(null);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const compressed = await compressImage(file);
      handleImageUpload(compressed);
    }
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
