const fs = require('fs');
const path = require('path');
const formatBytes = (bytes) => {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    let unitIndex = 0;
    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }

    return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}
const uploadFile = async (req, file, store_path) => {
    try {
        let file_url = null;
        
        // Ensure the directory exists or create it
        if (!fs.existsSync(store_path)) {
            fs.mkdirSync(store_path, { recursive: true });
            console.log(`Directory created: ${store_path}`);
        }

        const file_extension = file.filename.split('.').pop();
        const file_name = `${store_path}${Date.now().valueOf()}.${file_extension}`;

        // Copy the file to the target location
        await fs.promises.copyFile(file.path, file_name);
        console.log(`Success: ${file_name} file created`);

        file_url = `/${file_name}`;

        return {
            file_url,
            extension: file_extension,
            original_name: file.filename,
            size: formatBytes(file.bytes)
        };
    } catch (error) {
        console.error('Error:', error);
    }
};

const deleteFile = async (file_path) => {
    try {
        // Check if file exists
        let filePath = file_path
        if (file_path[0] == '/') {
            filePath = file_path.replace('/', '')
        }
        if (fs.existsSync(filePath)) {
            // Delete the file
            await fs.promises.unlink(filePath);
            console.log(`File deleted: ${filePath}`);
            return { success: true, message: 'File deleted successfully' };
        } else {
            console.log(`File not found: ${filePath}`);
            return { success: false, message: 'File does not exist' };
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return { success: false, message: 'Error deleting file', error };
    }
};
module.exports = {
    uploadFile,
    deleteFile
};
