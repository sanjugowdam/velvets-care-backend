
const { firebaseAuthClient, FIREBASE_PROJECT_ID } = require('../config/firebaseClient');

class PushNotification {
    static instance = null;

    constructor() {}

    static getInstance() {
        if (!PushNotification.instance) {
            PushNotification.instance = new PushNotification();
        }
        return PushNotification.instance;
    }

    async send(deviceId, title, body, image = null, category = null, extras = {}, userId = null) {
        try {
            const token = await firebaseAuthClient.getAccessToken();
            const normCategory = category ? category.trim().toLowerCase() : null;

            const payload = {
                message: {
                    token: deviceId,
                    notification: { title, body, ...(image ? { image } : {}) },
                    data: {
                        title,
                        body,
                        ...(normCategory ? { category: normCategory } : {}),
                        ...(image ? { image } : {}),
                        ...(extras.avatar ? { avatar: extras.avatar } : {}),
                        ...(extras.thumbnail ? { thumbnail: extras.thumbnail } : {}),
                    },
                    android: { priority: 'high' },
                    apns: {
                        headers: { 'apns-priority': '10' },
                        payload: {
                            aps: {
                                alert: { title, body },
                                ...(image ? { 'mutable-content': 1 } : {}),
                                ...(normCategory ? { category: normCategory } : {}),
                            },
                        },
                        ...(image ? { fcm_options: { image } } : {}),
                    },
                },
            };

            return await this.sendWithRetry(payload, token, userId, deviceId);

        } catch (error) {
            console.log(`FCM Send Failed for user ${userId}: ${error.message}`);
            return { success: false, error: error.message, userId, deviceId };
        }
    }

    async sendWithRetry(payload, token, userId, deviceId, maxRetries = 2) {
        let lastError = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000);

            try {
                const response = await fetch(
                    `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    }
                );

                clearTimeout(timeout);
                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) firebaseAuthClient.invalidateToken();
                    if ([400, 404].includes(response.status)) return result;
                    lastError = new Error(`FCM returned ${response.status}`);
                    continue;
                }

                console.log(`FCM sent successfully to ${userId}`);
                return result;

            } catch (error) {
                clearTimeout(timeout);
                lastError = error;
                if (attempt < maxRetries) {
                    const delay = Math.min(2000 * Math.pow(2, attempt - 1), 10000);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }

        throw lastError || new Error('FCM send failed after retries');
    }
}

const pushNotification = PushNotification.getInstance();
module.exports = { pushNotification };
