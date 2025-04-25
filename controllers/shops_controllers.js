const axios = require('axios');


const getFashionShops = async (req, res) => {
  const { lat, lng, type, radius } = req.query;

  try {
    const centerLat = parseFloat(lat);
    const centerLng = parseFloat(lng);
    const radiusInMeters = parseInt(radius) || 5000;
    const delta = radiusInMeters / 111000; // convert meters to approx degrees

    const response = await axios.post(
      'https://places.googleapis.com/v1/places:searchText',
      {
        textQuery: type || 'fashion shops in Bangalore',
        locationRestriction: {
          rectangle: {
            low: {
              latitude: centerLat - delta,
              longitude: centerLng - delta,
            },
            high: {
              latitude: centerLat + delta,
              longitude: centerLng + delta,
            }
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.location,places.photos'
        }
      }
    );
    console.log('Google API response:', response.data);
    const places = response.data.places.map(place => ({
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      rating: place.rating || null,
      location: place.location || null,
      image: place.photos && place.photos.length > 0
        ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=400`
        : null
    }));

    return res.response({
      success: true,
      message: 'Shops fetched successfully',
      data: places
    }).code(200);

  } catch (err) {
    console.error('Google API error:', err.response?.data || err.message);
    return res.response({
      success: false,
      message: 'Failed to fetch shops',
    }).code(500);
  }
};




  const searchShops = async (req, res) => {
    const { keyword, radius, lat, lng } = req.query;
  
    try {
      const response = await axios.post(
        'https://places.googleapis.com/v1/places:searchText',
        {
          textQuery: keyword || 'fashion shop',
          locationRestriction: {
            circle: {
              center: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng),
              },
              radius: radius ? parseInt(radius) : 5000, // default 5km if not given
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.location,places.photos'
          },
        }
      );
  
      const results = response.data.places.map(place => ({
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        rating: place.rating || null,
        location: place.location || null,
        place_id: place.id || null,
        image: place.photos && place.photos.length > 0
          ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?key=${process.env.GOOGLE_MAPS_API_KEY}&maxWidthPx=400`
          : null
      }));
  
      return res.response({
        success: true,
        message: 'Shops fetched successfully',
        data: results,
      }).code(200);
  
    } catch (error) {
      console.error('Google API Error:', error.response?.data || error.message);
      return res.response({
        success: false,
        message: 'Failed to fetch shops from Google Maps',
      }).code(500);
    }
  };
  


module.exports = {
    getFashionShops,
    searchShops
}