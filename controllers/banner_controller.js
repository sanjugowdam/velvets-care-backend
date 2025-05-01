const {
    Files,
    Banners
} = require('../models')
const {
    Op
} = require('sequelize')
const {
    FileFunctions, JWTFunctions
} = require('../helpers')

const banner_upload = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { image, title } = req.payload;

        if (!image) {
            throw new Error('Banner image required');
        }
        if (!title) {
            throw new Error('Banner title required');
        }
        const uploadedImage = await FileFunctions.uploadFile(req, image, 'uploads/banners/');
        const uploaded_files = await Files.create({
            files_url: uploadedImage.file_url,
            extension: uploadedImage.extension,
            original_name: uploadedImage.original_name,
            size: uploadedImage.size
        })
       const banner = await Banners.create({
            banner_image_id: uploaded_files.id,
            title: title
        })
        return res.response({
            success: true,
            message: 'Banner uploaded successfully',
            data: banner
        }).code(200);
        
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
        
    }
}

const get_banner_users = async (req, res) => {
    try {
        const banner = await Banners.findAll({
            include: [
                {
                    model: Files,
                    required: true
                }
            ]
        })
        return res.response({
            success: true,
            message: 'Banners fetched successfully',
            data: banner
        }).code(200);
        
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
        
    }
}
const banner_delete = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { banner_id } = req.payload;
        const banner = await Banners.findOne({ where: { id: banner_id } });
        if (!banner) {
            throw new Error('Banner not found');
        }
        await banner.destroy({
            where: {
                id: banner_id
            }
        })
        return res.response({
            success: true,
            message: 'Banner deleted successfully',
        }).code(200);
        
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
        
    }
}
const get_banner_admin = async (req, res) => {
    try {
      const session_user = req.headers.user;
        if(!session_user){
            throw new Error('Session expired');
        }
        const { limit, page } = req.query;
        
        const banners_count = await Banners.count();
        const banners = await Banners.findAll({
            include: [
                {
                    model: Files,
                    required: true
                }
            ],
            limit: limit,
            offset: (page - 1) * limit,
        });
        return res.response({ 
            success: true,
            message: 'Banners fetched successfully',
            data: banners,
            total: banners_count,
            page: page,
            limit: limit
        }).code(200);
        
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
        
    }
}
module.exports = {
    banner_upload,
    get_banner_users,
    banner_delete,
    get_banner_admin
}