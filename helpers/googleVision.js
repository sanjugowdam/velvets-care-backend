// const vision = require('@google-cloud/vision');
// require('dotenv').config(); // Load environment variables


// const client = new vision.ImageAnnotatorClient({
//   credentials: {
//     apiKey: process.env.GOOGLE_API_KEY, // Use API Key from the .env file
//   }
// });

// // Function to analyze the image using Google Vision
// const analyzeImage = async (imagePath) => {
//   try {
//     // Perform text detection on the image
//     const [result] = await client.textDetection(imagePath);
//     const detections = result.textAnnotations;

//     // Return detected text from the image
//     if (detections.length > 0) {
//       return detections.map(text => text.description).join(' ');
//     } else {
//       return 'No text detected in the image.';
//     }
//   } catch (error) {
//     console.error('Error analyzing image with Google Vision:', error);
//     throw new Error('Google Vision API error: ' + error.message);
//   }
// };

// module.exports = { analyzeImage };
