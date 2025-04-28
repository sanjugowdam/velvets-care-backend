const jsQR = require('jsqr');  // QR/Barcode scanning library
const { createCanvas, loadImage } = require('canvas');  // Canvas library to manipulate images
const fs = require('fs');

// Function to scan QR code or barcode from image
const scanQRCodeOrBarcode = async (imagePath) => {
  try {
    // Load the image using the `canvas` library
    const image = await loadImage(imagePath);
    
    // Resize the image to fit within a max dimension (e.g., 1000px)
    const MAX_DIMENSION = 1000;
    let width = image.width;
    let height = image.height;
    
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
      width = Math.floor(width * scale);
      height = Math.floor(height * scale);
    }

    // Create a canvas to get pixel data
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    
    // Draw the resized image on the canvas
    context.drawImage(image, 0, 0, width, height);

    // Get pixel data from the canvas
    const imageData = context.getImageData(0, 0, width, height);
    
    // Use `jsQR` to scan the QR code/barcode
    const code = jsQR(imageData.data, width, height);
    
    if (code) {
      // Return the data from the QR code/barcode
      return { data: code.data, type: 'QR/Barcode' };  // Data extracted from QR/Barcode
    } else {
      throw new Error('No QR code or barcode found in the image.');
    }
  } catch (error) {
    console.error('Error scanning QR code/barcode:', error.message);
    throw new Error('Failed to scan QR code/barcode');
  }
};

module.exports = { scanQRCodeOrBarcode };
