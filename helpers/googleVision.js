const axios = require('axios');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const analyzeImage = async (imagePath) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    const imageBuffer = await fs.promises.readFile(imagePath); // Read image file
    const imageBase64 = imageBuffer.toString('base64'); // Convert to base64

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: {
              content: imageBase64, // Base64 encoded image data
            },
            features: [
              { type: 'TEXT_DETECTION' },
              { type: 'DOCUMENT_TEXT_DETECTION' },
              { type: 'BARCODE_DETECTION' },
            ],
          },
        ],
      }
    );

    const detections = response.data.responses[0];
    const textDetected = detections.textAnnotations || [];
    const barcodeDetected = detections.barcodeAnnotations || [];

    let extractedText = '';
    if (textDetected.length > 0) {
      extractedText = textDetected.map((text) => text.description).join(' ');
    }

    let barcodeData = '';
    if (barcodeDetected.length > 0) {
      barcodeData = barcodeDetected.map((barcode) => barcode.rawValue).join(', ');
    }

    return {
      text: extractedText || 'No text detected.',
      barcode: barcodeData || 'No barcode detected.',
    };
  } catch (error) {
    console.error('Error analyzing image with Google Vision:', error);
    throw new Error('Google Vision API error: ' + error.message);
  }
};

module.exports = { analyzeImage };
