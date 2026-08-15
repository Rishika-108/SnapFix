/**
 * Client-side Image Compression Utility
 * Resizes large camera photos (e.g. 8-15MB) to max 1280px dimensions and 0.82 JPEG quality
 * to reduce upload latency by ~90% before sending over network to backend & AI services.
 */
export const compressImage = (file, maxWidth = 1280, maxHeight = 1280, quality = 0.82) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;

        if (width <= maxWidth && height <= maxHeight && file.size < 500 * 1024) {
          // File is already small enough, no compression needed
          resolve(file);
          return;
        }

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const compressedFile = new File([blob], file.name || "report.jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            console.log(
              `⚡ Compressed image: ${(file.size / 1024 / 1024).toFixed(2)} MB -> ${(
                compressedFile.size / 1024
              ).toFixed(2)} KB`
            );
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};
