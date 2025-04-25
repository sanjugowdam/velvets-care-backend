const axios = require('axios');



const getFashionShops = async (req, res) => {
    const { lat, long, type, radius } = req.query;

    try {
        const centerLat = parseFloat(lat);
        const centerLng = parseFloat(long);
        let radiusInMeters = parseInt(radius);
        if (isNaN(radiusInMeters) || radiusInMeters < 1 || radiusInMeters > 80000) {
            radiusInMeters = 50000; // fallback to 5 km if invalid
        }
        console.log("Sending request with lat:", centerLat, "lng:", centerLng);

        // 1. Corrected Type Handling
        const placeType = type || 'clothing_store';
        const requestBody = {  // Encapsulate the request body for easier logging
            includedTypes: [placeType],
            locationRestriction: {
                circle: {
                    center: {
                        latitude: centerLat,
                        longitude: centerLng,
                    },
                    radius: radiusInMeters,
                },
            },
        };

        // 2. Log the complete request being sent to the API
        console.log("Google Places API Request:", {
            url: 'https://places.googleapis.com/v1/places:searchNearby',
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': '*'
            }
        });

        const response = await axios.post(
            'https://places.googleapis.com/v1/places:searchNearby',
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
                    'X-Goog-FieldMask': '*'
                }
            }
        );

        // 3.  Log the raw response from the API
        console.log("Google Places API Response:", response.data);

        const rawPlaces = response?.data?.places || [];

        const places = rawPlaces.map(place => ({
            name: place.displayName?.text || '',
            address: place.formattedAddress || '',
            rating: place.rating || null,
            location: place.location || null,
            image: place.photos?.[0]?.name
                ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=400`
                : null,
        }));

        // 4. Improved Success Response
        return res.response({
            success: true,
            message: rawPlaces.length > 0 ? 'Shops fetched successfully' : 'No shops found matching the criteria',
            data: places,
        }).code(200);

    } catch (err) {
        // 5. Enhanced Error Handling
        console.error('Google Places API Error:', err.response ? err.response.data : err.message);
        return res.response({
            success: false,
            message: 'Failed to fetch shops: ' + (err.response ? err.response.data.error_message || 'An error occurred' : err.message),
            error: err.response ? err.response.data : { message: err.message }, // Include more error details
        }).code(500);
    }
};



const searchShops = async (req, res) => {
    const { keyword, radius, lat, long } = req.query;
  
    try {
      // Validate inputs
      if (!lat || !long) {
        return res.response({ success: false, message: 'Latitude and Longitude are required' }).code(400);
      }
  
      const searchRadius = Math.min(parseInt(radius) || 5000, 50000); // limit to max 50km
      const requestBody = {
        textQuery: keyword || 'fashion shop',
        location_bias: {
          circle: {
            center: {
              latitude: parseFloat(lat),
              longitude: parseFloat(long)
            },
            radius: searchRadius
          }
        }
      };
  
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.location,places.photos'
          }
        }
      );
  
      const places = response?.data?.places?.map(place => ({
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        rating: place.rating || null,
        location: place.location || null,
        image: place.photos?.[0]?.name
          ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=400`
          : null
      })) || [];
  
      return res.response({
        success: true,
        message: places.length > 0 ? 'Shops fetched successfully' : 'No shops found',
        data: places
      }).code(200);
  
    } catch (err) {
      console.error('Google Places API error:', err.response?.data || err.message);
      return res.response({
        success: false,
        message: 'Failed to fetch shops',
        error: err.response?.data || { message: err.message }
      }).code(500);
    }
  };

  


module.exports = {
    getFashionShops,
    searchShops
}