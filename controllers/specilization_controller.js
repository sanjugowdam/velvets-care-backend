const {
    Specialization
} = require('../models')
const {
    Op,
    where
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const { TwilioFunctions, FileFunctions } = require('../helpers');
const { Doctors } = require('../models');

const createSpecialization = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { name } = req.payload;
        if (!name) {
            throw new Error('Specialization name is required');
        }
        const specialization = await Specialization.create({ name });
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

const getAllSpecializations = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const specializations = await Specialization.findAll({
            where: {
                deletedAt: null
            }
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
        const { specializationId } = req.params;
        if (!specializationId) {
            throw new Error('Specialization ID is required');
        }
        const doctors = await Specialization.findAll({
            where: {
                id: specializationId,
                deletedAt: null
            },
            include: [{
                model: Doctors,
                as: 'doctors'
            }]
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

module.exports = {
    createSpecialization,
    getAllSpecializations,
    getdoctorsbasedonspecialization
}