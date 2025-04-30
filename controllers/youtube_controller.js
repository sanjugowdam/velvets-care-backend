require('dotenv').config();
const axios = require('axios');

const youtube = async (request, h) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  try {
    const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        key: apiKey,
        channelId: channelId,
        part: 'snippet',
        order: 'date',
        maxResults: 5
      }
    });

    const videos = res.data.items
      .filter(item => item.id.kind === 'youtube#video')
      .map(video => ({
        videoId: video?.id?.videoId,
        title: video?.snippet?.title,
        description: video?.snippet?.description,
        thumbnail: video?.snippet?.thumbnails?.high?.url,
        publishedAt: video?.snippet?.publishedAt
        
      }));

    return h.response({ 
      success: true,
      message: 'Videos fetched successfully',
      data: videos
     }).code(200);
  } catch (err) {
    console.error('Error fetching videos:', err);
    return h.response({ error: 'Failed to fetch videos' }).code(500);
  }
};

module.exports = {
  youtube
};
