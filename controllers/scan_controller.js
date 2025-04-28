const fs = require('fs');
const path = require('path');
const { Scans, Files, Users } = require('../models');  // Sequelize models for SCANS and File tables
const { FileFunctions, GoogleFunctions , ScannerFunctions} = require('../helpers');  // Existing helper for Google Vision
const { getAddressFromCoordinates } = require('./reverseGeocode');

// Controller to handle scanning product tag QR code or barcode
const scanProductTag = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        console.log(session_user, "session checker");
        const user = await Users.findOne({ where: { id: session_user.user_id }, raw: true });
        console.log(user,  "user checker");

        if (user) {
            const { image, lat, long } = req.payload;
            console.log(image, lat, long);
            if (!image || !lat || !long) {
                return res.response({
                    success: false,
                    message: 'Image, latitude, and longitude are required',
                }).code(400);
            }
            const adress_data = await getAddressFromCoordinates(lat, long);

            // const storePath = path.join(__dirname, './uploads/scan_data');
            const uploadedImage = await FileFunctions.uploadFile(req, image, './uploads/scan_data/');

            const uploaded_files = await Files.create({
                file_url: uploadedImage.file_url,
                extension: uploadedImage.extension,
                original_name: uploadedImage.original_name,
                size: uploadedImage.size,
                user_id: user.id
            });
            
            const scan_data = await ScannerFunctions.scanQRCode(image.path);
            if (!scan_data) {
                return res.response({
                    success: false,
                    message: 'Failed to process image',
                }).code(500);
            }
            const scan = await Scans.create({
                lat: lat,
                long: long,
                adress: adress_data,
                scan_data: scan_data,
                image_id: uploaded_files.id,
                user_id: user.id,
            });
            // 6. Send a success response
            return res.response({
                success: true,
                message: 'Product tag scanned and processed successfully',
                data: scan,  // Return the scan data
            }).code(200);

        }
        throw new Error('User not found');
    } catch (err) {
        console.error('Error:', err.message);
        return res.response({
            success: false,
            message: err.message,
            error: err,
        }).code(500);
    }
};

module.exports = { 
    scanProductTag
 };
