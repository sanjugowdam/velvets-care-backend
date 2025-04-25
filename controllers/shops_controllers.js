

const getFashionShops = async (req, res) => {
    const { lat, lng, type, radius } = req.query;

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${lat},${lng}`,
                radius: radius,
                keyword: type,
                key: process.env.GOOGLE_MAPS_API_KEY,
            }
        });

        const places = response.data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            location: place.geometry.location,
            place_id: place.place_id,
            image: place.photos && place.photos.length > 0
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${shop.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            : null
        }));

        return res.response({
            success: true,
            message: 'Shops fetched successfully',
            data: places
        }).code(200);
    } catch (err) {
        console.error(err);
        return res.response({
            success: false,
            message: 'Google Maps API error'
        }).code(500);
    }
};

const searchShops = async (req, res) => {
    const { keyword, radius } = req.query;
  
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
        params: {
          radius,
          keyword,
          key: process.env.GOOGLE_MAPS_API_KEY,
        }
      });
  
      const results = response.data.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        location: place.geometry.location,
        place_id: place.place_id,
        image: place.photos && place.photos.length > 0
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${shop.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        : null
      }));
  
      return res.response({
        success: true,
        message: 'Shops fetched successfully',
        data: results,
      }).code(200);
    } catch (error) {
      console.error(error);
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