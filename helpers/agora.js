const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const generateRtcToken = (channelName, uid, role = RtcRole.PUBLISHER, expireInSeconds = 3600) => {
  const appID = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appID || !appCertificate) {
    throw new Error('Missing Agora credentials in environment variables');
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expireTimestamp = currentTimestamp + expireInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    expireTimestamp
  );

  return token;
};

module.exports = {
  generateRtcToken
};
