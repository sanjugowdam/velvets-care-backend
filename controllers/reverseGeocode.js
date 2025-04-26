const axios = require('axios');

const getAddressFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${lat},${lng}`,  // Pass the latitude and longitude
        key: process.env.GOOGLE_API_KEY,  // Your Google API Key
      }
    });

    // Check if the response contains results
    if (response.data.results.length > 0) {
      const address = response?.data?.results?.[0]?.formatted_address;
      return address;  // Return the first address result
    } else {
      throw new Error('No address found for the given coordinates');
    }
  } catch (error) {
    console.error('Error in reverse geocoding:', error.message);
    throw new Error('Failed to retrieve address from coordinates');
  }
};

module.exports = { 
    getAddressFromCoordinates 
};
