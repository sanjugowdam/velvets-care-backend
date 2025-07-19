
const {
    Op,
    where
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const { TwilioFunctions, FileFunctions } = require('../helpers');
const { Doctors, Specialization, Files } = require('../models');

const createSpecialization = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { name, icon } = req.payload;
        if (!name) {
            throw new Error('Specialization name is required');
        }
        const iconpath = 'uploads/specialization-icons/';
    const iconFile = await FileFunctions.uploadFile(icon, 'icon', iconpath);
         const iconStore = await Files.create({
                file_url: iconFile.file_url,
                extension: iconFile.extension,
                original_name: iconFile.original_name,
                size: iconFile.size
            });
        const specialization = await Specialization.create({ name, icon_id: iconStore.id });
        return res.response({
            success: 'true',
            message: 'Specialization created successfully',
            data:specialization
        });
    } catch (error) {
        console.error('Error creating specialization:', error);
        return res.response({
            success: 'false',
            message: `Error creating specialization: ${error.message}`
        }).status(200);
    }
}

const getAllSpecializationsAdmin = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { page, limit, search } = req.query;
         let offset;
        if(page && limit){
           offset = (page - 1) * limit
        }
        let filter = {};
        if (search) {
            filter = {
                ...filter,
                name: {
                    [Op.like]: `%${search}%`
                }
            };
        }
        const specializations = await Specialization.findAll({
            include: [{
                model: Files,
            }],
            where: filter,
            ...offset ? {offset} : {},
            limit: limit,

        });
        return res.response({
            success: 'true',
            message: 'Specializations fetched successfully',
            data: specializations
        });
    } catch (error) {
        console.error('Error fetching specializations:', error);
        return res.response({
            success: 'false',
            message: `Error fetching specializations: ${error.message}`
        }).status(200);
    }
}

const getdoctorsbasedonspecialization = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { id } = req.query;
        if (!id) {
            throw new Error('Specialization ID is required');
        }
        const doctors = await Doctors.findAll({
            where: {
                specialization_id: id,
            },
            include: [{
                model: Files,
                as: 'profile_image_file'
            },]
        });
        return res.response({
            success: 'true',
            message: 'Doctors fetched successfully',
            data: doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return res.response({
            success: 'false',
            message: `Error fetching doctors: ${error.message}`
        }).status(200);
    }
}

const getspecilaizationsUsers = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const specialization = await Specialization.findOne({
           include: [{
                model: Files,
            }],
        });
        if (!specialization) {
            throw new Error('Specialization not found');
        }
        return res.response({
            success: 'true',
            message: 'specialization fetched successfully',
            data: specialization
        });
    } catch (error) {
        console.error('Error fetching specialization:', error);
        return res.response({
            success: 'false',
            message: `Error fetching specialization: ${error.message}`
        }).status(200);
    }
}

const deleteSpecialization = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { id } = req.payload;
        if (!id) {
            throw new Error('Specialization ID is required');
        }
        const specialization = await Specialization.findOne({ where: { id } });
        if (!specialization) {
            throw new Error('Specialization not found');
        }
        await specialization.destroy();
        return res.response({
            success: 'true',
            message: 'Specialization deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting specialization:', error);
        return res.response({
            success: 'false',
            message: `Error deleting specialization: ${error.message}`
        }).status(200);
    }
}
const updateSpecialization = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { id, name, icon } = req.payload;
        if (!id || !name) {
            throw new Error('Specialization ID and name are required');
        }
        const specialization = await Specialization.findOne({ where: { id } });
        if (!specialization) {
            throw new Error('Specialization not found');
        }
        if (icon) {
            const iconpath = 'uploads/specialization-icons/';
            const iconFile = await FileFunctions.uploadFile(icon, 'icon', iconpath);
            const iconStore = await Files.create({
                file_url: iconFile.file_url,
                extension: iconFile.extension,
                original_name: iconFile.original_name,
                size: iconFile.size
            });
            specialization.icon_id = iconStore.id;
        }
        const updatedData = await Specialization.update({
            name,
            icon_id: specialization.icon_id
        }, {
            where: {
                id: specialization.id
            }
        });
        return res.response({
            success: 'true',
            message: 'Specialization updated successfully',
            data: updatedData
        });
    } catch (error) {
        console.error('Error updating specialization:', error);
        return res.response({
            success: 'false',
            message: `Error updating specialization: ${error.message}`
        }).status(200);
    }
}
module.exports = {
    createSpecialization,
    getAllSpecializationsAdmin,
    getdoctorsbasedonspecialization,
    getspecilaizationsUsers,
    updateSpecialization,
    deleteSpecialization
}