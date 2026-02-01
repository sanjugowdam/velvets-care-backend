const { JWT } = require('google-auth-library');

const {
    FIREBASE_PRIVATE_KEY,
    FIREBASE_PROJECT_ID,
    FIREBASE_SERVICE_ACCOUNT_EMAIL
} = process.env;

class FirebaseAuthClient {
    constructor() {
        this.client = new JWT({
            email: FIREBASE_SERVICE_ACCOUNT_EMAIL,
            key: (FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
        });

        this.accessToken = null;
        this.tokenExpiry = null;
        this.tokenFetchPromise = null;
    }

    async getAccessToken() {
        const now = Date.now();

        if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry - 5 * 60 * 1000) {
            return this.accessToken;
        }

        if (this.tokenFetchPromise) {
            return this.tokenFetchPromise;
        }

        this.tokenFetchPromise = this.fetchNewToken();

        try {
            return await this.tokenFetchPromise;
        } finally {
            this.tokenFetchPromise = null;
        }
    }

    async fetchNewToken() {
        const { token, res } = await this.client.getAccessToken();
        if (!token) throw new Error('Failed to obtain Firebase access token');

        this.accessToken = token;
        this.tokenExpiry = Date.now() + ((res?.data?.expires_in ?? 3600) * 1000);

        return token;
    }

    invalidateToken() {
        this.accessToken = null;
        this.tokenExpiry = null;
        this.tokenFetchPromise = null;
    }
}

const firebaseAuthClient = new FirebaseAuthClient();

module.exports = { firebaseAuthClient, FIREBASE_PROJECT_ID };
