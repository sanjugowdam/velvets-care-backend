const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const fs = require('fs');


// Format size function
const formatBytes = (bytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }
    return `${bytes.toFixed(2)} ${units[unitIndex]}`;
};

// AWS S3 Configuration
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Upload file to S3
const uploadFile = async (file, store_path = "") => {
    try {
        // Guard for optional file
        if (!file) {
            return null;
        }

        const originalName = file.hapi?.filename || file.filename;
        if (!originalName) {
            return null; // no filename, skip
        }

        const file_extension = originalName.split('.').pop();
        const uniqueFileName = `${store_path}${Date.now()}-${uuidv4()}.${file_extension}`;

        // Get file buffer
        const fileContent = file._data || (file.path ? await fs.promises.readFile(file.path) : null);
        if (!fileContent) {
            throw new Error("File content not found");
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: uniqueFileName,
            Body: fileContent,
            ContentType: file.hapi?.headers['content-type'] || file.headers?.['content-type'] || 'application/octet-stream'
        };

        const data = await s3.upload(params).promise();


        const file_url = data?.Key;

        return {
            file_url,
            extension: file_extension,
            original_name: originalName,
            size: formatBytes(Buffer.byteLength(fileContent))
        };
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw error;
    }
};

// Delete file from S3
const deleteFile = async (file_path) => {
    try {
        if (!file_path) {
            return { success: false, message: 'No file path provided' };
        }

        let key = file_path;
        if (file_path.startsWith('/')) key = file_path.slice(1);
        if (file_path.startsWith('http')) {
            const urlParts = new URL(file_path);
            key = decodeURIComponent(urlParts.pathname).slice(1);
        }

        const params = {
            Bucket: BUCKET_NAME,
            Key: key
        };

        await s3.deleteObject(params).promise();
        console.log(`File deleted from S3: ${key}`);
        return { success: true, message: 'File deleted successfully' };
    } catch (error) {
        console.error('S3 Delete Error:', error);
        return { success: false, message: 'Error deleting file', error };
    }
};

function getFileUrl(key, expiresIn = 3600) {
    console.log(key);

    return s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: key,
        Expires: expiresIn // in seconds (default 1 hour)
    });
}

module.exports = {
    uploadFile,
    deleteFile,
    getFileUrl
};
