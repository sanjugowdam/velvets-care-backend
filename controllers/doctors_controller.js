const {
    Doctors,
    Doctorsavailability,
    Adresses,
    Otps,
    Files
} = require('../models')
const {
    Op
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const { TwilioFunctions, FileFunctions } = require('../helpers')

const updateBasicDetails = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {
            full_name, gender, date_of_birth, phone, email,
            specialization, years_of_experience, registration_number,
            registration_certificate, medical_degree_certificate,
            consultation_fee, consultation_modes, languages_spoken
        } = req.payload;
            const existing_doctor = await Doctors.findOne({
                where: {
                    [Op.or]: [
                        { phone: phone },
                        { email: email }
                    ]
                }
            })

            if (existing_doctor) {
                throw new Error('Doctor already exists');
            }
        // File Uploads
        let regCertFileId = null;
        let degreeCertFileId = null;

        if (registration_certificate) {
            const regPath = await FileFunctions.uploadFile(req, registration_certificate, 'uploads/registration_certificates/');
            const uploadedfile = await FileFunctions.uploadFile(req, image, regPath);
            const regFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            regCertFileId = regFile.id;
        }

        if (medical_degree_certificate) {
            const degreePath = await FileFunctions.uploadFile(req, medical_degree_certificate, 'uploads/medical_degree_certificates/');
            const uploadedfile = await FileFunctions.uploadFile(req, image, degreePath);
            const degreeFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            degreeCertFileId = degreeFile.id;
        }

        const doctor = await Doctor.create({
            full_name,
            gender,
            date_of_birth,
            phone,
            email,
            specialization,
            years_of_experience,
            registration_number,
            registration_certificate_id: regCertFileId,
            medical_degree_certificate_id: degreeCertFileId,
            consultation_fee,
            consultation_modes,
            languages_spoken
        });

        return h.response({ success: true, doctor }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({ success: false, message: 'Error updating basic details' }).code(500);
    }
};


const updateAddress = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {
            street, area, city, state, country, zip,
            landmark, latitude, longitude, doctor_id
        } = req.payload;

        const address = await Address.create({
            street, area, city, state, country, zip,
            landmark, latitude, longitude
        });

        await Doctor.update({ address_id: address.id }, { where: { id: doctor_id } });

        return h.response({ success: true, address }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({ success: false, message: 'Error saving address' }).code(500);
    }
};



const updateAvailability = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id, availability } = req.payload;

        const bulkAvailability = availability.map(slot => ({
            doctor_id,
            day: slot.day,
            start_time: slot.start_time,
            end_time: slot.end_time
        }));

        await DoctorAvailability.bulkCreate(bulkAvailability);

        return h.response({ success: true, message: 'Availability updated' }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({ success: false, message: 'Error updating availability' }).code(500);
    }
};

const updateStatus = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id, status, verified } = req.payload;

        await Doctor.update({ status, verified }, { where: { id: doctor_id } });

        return h.response({ success: true, message: 'Status updated' }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({ success: false, message: 'Error updating status' }).code(500);
    }
};

module.exports = {
    updateBasicDetails,
    updateAddress,
    updateAvailability,
    updateStatus
}
