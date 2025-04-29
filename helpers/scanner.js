const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const jsQR = require('jsqr');

const scanQRCodeOrBarcode = async (imagePath) => {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error('Image file does not exist.');
    }

    const imageBuffer = await fs.promises.readFile(imagePath);
    const image = await loadImage(imageBuffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (!code || !code.data || typeof code.data !== 'string' || code.data.trim() === '') {
      console.error('No valid QR code found.');
      throw new Error('No valid QR code detected.');
    }
  
    console.log('QR Code data:', code.data);
    if (typeof scanData !== 'string' || scanData.trim() === '') {
      throw new Error('Scan data must be a non-empty string.');
    }
  } catch (error) {
    console.error('Error scanning QR code:', error.message);
    throw new Error('Failed to process the image');
  }
};

module.exports = { scanQRCodeOrBarcode };
