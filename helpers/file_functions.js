const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Format size function remains unchanged
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
const uploadFile = async (req, file, store_path) => {
    try {
        const file_extension = file.filename.split('.').pop();
        const uniqueFileName = `${store_path}${Date.now()}-${uuidv4()}.${file_extension}`;

        const fileContent = await fs.promises.readFile(file.path);

        const params = {
            Bucket: BUCKET_NAME,
            Key: uniqueFileName,
            Body: fileContent,
            ContentType: file.headers['content-type']
        };

        await s3.upload(params).promise();

        const file_url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;

        return {
            file_url,
            extension: file_extension,
            original_name: file.filename,
            size: formatBytes(file.bytes)
        };
    } catch (error) {
        console.error('S3 Upload Error:', error);
        throw error;
    }
};

// Delete file from S3
const deleteFile = async (file_path) => {
    try {
        let key = file_path;
        if (file_path.startsWith('/')) key = file_path.slice(1);
        if (file_path.startsWith('http')) {
            const urlParts = new URL(file_path);
            key = decodeURIComponent(urlParts.pathname).slice(1); // Remove leading '/'
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

module.exports = {
    uploadFile,
    deleteFile
};
