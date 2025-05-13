const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('YOUR_GOOGLE_CLIENT_ID');

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: 'YOUR_GOOGLE_CLIENT_ID',
  });
  return ticket.getPayload();
}

module.exports = {
     verifyGoogleToken 
    };
