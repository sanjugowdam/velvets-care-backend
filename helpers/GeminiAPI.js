const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config(); // Load environment variables

// Function to extract fabric data from GMini API
const analyzeFabricTag = async (imagePath) => {
  try {
    // Create form data for uploading the image
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));  // Assuming you're sending a file

    // Send a POST request to GMini API to process the image
    const response = await axios.post('https://gmini.com/api/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.GMINI_API_KEY}`,  // API key from environment variables
      }
    });

    // Check if the response contains data
    if (response.data) {
      // Extract the relevant fabric data
      const { cottonPercentage, fabricType, careInstructions, composition } = response.data;

      // Processed data to return
      return {
        cottonPercentage,
        fabricType,
        careInstructions,
        composition,  // Example: { cotton: "85%", polyester: "15%" }
      };
    } else {
      throw new Error('No data received from GMini API');
    }
  } catch (error) {
    console.error('Error processing with GMini API:', error.message);
    throw new Error('GMini API error: ' + error.message);
  }
};

module.exports = { analyzeFabricTag };
