const jsQR = require('jsqr');  // QR/Barcode scanning library
const { createCanvas, loadImage } = require('canvas');  // Canvas library to manipulate images
const fs = require('fs');
const path = require('path');

// Function to scan QR code/barcode from image
const scanQRCode = async (imagePath) => {
  try {
    // Load the image using the `canvas` library
    const image = await loadImage(imagePath);
    
    // Create a canvas to get pixel data
    const canvas = createCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    
    // Draw the image on the canvas
    context.drawImage(image, 0, 0, image.width, image.height);
    
    // Get pixel data from the canvas
    const imageData = context.getImageData(0, 0, image.width, image.height);
    
    // Use `jsQR` to scan the QR code/barcode
    const code = jsQR(imageData.data, image.width, image.height);
    
    if (code) {
      // Return the data from the QR code/barcode
      return code.data;  // This is the data extracted from the QR code/barcode
    } else {
      throw new Error('No QR code or barcode found in the image.');
    }
  } catch (error) {
    console.error('Error scanning QR code/barcode:', error.message);
    throw new Error('Failed to scan QR code/barcode');
  }
};

module.exports = { scanQRCode };
