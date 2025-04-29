const axios = require('axios');
const fs = require('fs');
const { BrowserMultiFormatReader, NotFoundException } = require('@zxing/library');
const { createCanvas, loadImage } = require('canvas');
require('dotenv').config(); // Load GOOGLE_API_KEY from .env

const analyzeImage = async (imagePath) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key missing.');
    }

    // 1. Read and encode image
    const imageBuffer = await fs.promises.readFile(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    // 2. Parallel Scan: Google Vision + ZXing
    const [googleText, barcodeData] = await Promise.all([
      scanWithGoogleVision(imageBase64, apiKey),
      scanWithZXing(imagePath)
    ]);

    // 3. Return Clean Result
    return {
      text: googleText,
      barcode: barcodeData
    };

  } catch (error) {
    console.error('Error analyzing image:', error.response?.data || error.message);
    throw new Error('Failed to process image.');
  }
};

// Scan Text using Google Vision
async function scanWithGoogleVision(imageBase64, apiKey) {
  try {
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: { content: imageBase64 },
            features: [
              { type: 'TEXT_DETECTION' }
            ],
          },
        ],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const detections = response.data.responses[0];
    let extractedText = '';

    if (detections && detections.textAnnotations && detections.textAnnotations.length > 0) {
      extractedText = detections.textAnnotations[0].description || '';
    }

    if (!extractedText || typeof extractedText !== 'string' || extractedText.trim() === '') {
      return 'No valid text found.';
    }

    return formatExtractedText(extractedText);
  } catch (error) {
    console.error('Google Vision scan failed:', error.response?.data || error.message);
    return 'Failed to scan with Google Vision.';
  }
}

// Scan Barcode/QR using ZXing
async function scanWithZXing(imagePath) {
  try {
    const image = await loadImage(imagePath);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const reader = new BrowserMultiFormatReader();
    const result = await reader.decodeFromImage(undefined, canvas.toDataURL());

    return result.getText();
  } catch (error) {
    if (error instanceof NotFoundException) {
      console.error('No barcode or QR code found.');
      return 'No barcode or QR code detected.';
    } else {
      console.error('ZXing scan failed:', error.message);
      return 'Failed to scan with ZXing.';
    }
  }
}

// Helper function to clean and format text nicely
function formatExtractedText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let cleaned = rawText
    .replace(/\s+/g, ' ') // Merge multiple spaces/newlines
    .replace(/ ,/g, ',') // Fix space before commas
    .replace(/:\s*/g, ': ') // Standardize colons
    .replace(/Inc of all taxes/gi, 'Inclusive of all taxes')
    .replace(/PKD on/gi, 'Packed on')
    .replace(/NET QTY/gi, 'Net Quantity')
    .replace(/WASHING CARE/gi, 'Washing Care Instructions')
    .replace(/MRP :/gi, 'MRP:')
    .replace(/MRP:/gi, 'MRP:')
    .replace(/MADE IN INDIA/gi, 'Made in India')
    .trim();

  return cleaned;
}

module.exports = { analyzeImage };
