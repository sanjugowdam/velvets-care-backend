const {
    Doctors,
    Doctorsavailability,
    Adresses,
    Otps,
    Files
} = require('../models')
const {
    Op,
    where
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')

const { TwilioFunctions, FileFunctions } = require('../helpers');
const { ComplianceInquiriesContextImpl } = require('twilio/lib/rest/trusthub/v1/complianceInquiries');
const { default: ClientCapability } = require('twilio/lib/jwt/ClientCapability');

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

        const doctor = await Doctors.create({
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

        return h.response({
            success: true,
            message: 'Basic details updated successfully',
            data: doctor
        }).code(201);
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

        const doctor = await Doctors.findOne({
            where: { id: doctor_id }
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const available_address = await Adresses.findOne({
            where: {
                doctor_id: doctor_id
            }
        })

        if (available_address) {
            await available_address.update({
                street: street,
                area: area,
                city: city,
                state: state,
                country: country,
                zip: zip,
                landmark: landmark,
                latitude: latitude,
                longitude: longitude
            },
        {
            where: {
                id: available_address.id
            }
        });
        }
        else{
 const address = await Adresses.create({
            street: street,
            area: area,
            city: city,
            state: state,
            country: country,
            zip: zip,
            landmark: landmark,
            latitude: latitude,
            longitude: longitude,
            doctor_id: doctor_id
        });
        }
        // await Doctor.update({ address_id: address.id }, { where: { id: doctor_id } });
        return h.response({ 
            success: true, 
            message: 'Address updated successfully',
            data: address 
        }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({
             success: false,
              message: 'Error saving address'
             }).code(200);
    }
};



const updateAvailability = async (req, h) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) {
      throw new Error('Session expired');
    }

    const { doctor_id, availability } = req.payload;

    const doctor = await Doctors.findOne({ where: { id: doctor_id } });
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    for (const slot of availability) {
      const existingSlot = await Doctorsavailability.findOne({
        where: {
          doctor_id,
          day: slot.day,
          start_time: slot.start_time,
          end_time: slot.end_time
        }
      });

      if (existingSlot) {
        // Update slot if needed
        await existingSlot.update({
          ...slot
        },
        {
          where: {
            id: existingSlot.id
          }
        });
      } else {
        // Create new slot
        await Doctorsavailability.create({
          doctor_id,
          day: slot.day,
          start_time: slot.start_time,
          end_time: slot.end_time
        });
      }
    }

    return h.response({
      success: true,
      message: 'Availability updated successfully',
      data: availability
    }).code(200);

  } catch (err) {
    console.error(err);
    return h.response({
      success: false,
      message: err.message || 'Error updating availability'
    }).code(500);
  }
};


const updateStatus = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id, status, verified } = req.payload;

        await Doctors.update({ 
            status: status,
             verified: verified 
            }, 
            {
             where: {
                 id: doctor_id 
                } });

        return h.response({
             success: true,
             message: 'Status updated'

             }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
             success: false,
              message: 'Error updating status'
             }).code(200);
    }
};
const doctorlist_user = async (req, h) => {
    try {
        // const session_user = req.headers.user;
        // if (!session_user) {
        //     throw new Error('Session expired');
        // }
        const doctor = await Doctors.findAll({ 
                include: [
                    {
                        model: Adresses
                    },
                    {
                        model: Doctorsavailability
                    }
                ],
            where: {
                 verified: true
                 }
        });
        return h.response({
            success: true,
            message: 'Doctor list fetched successfully',
            data: doctor
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: 'Error finding doctor'
        }).code(200);
    }
};

module.exports = {
    updateBasicDetails,
    updateAddress,
    updateAvailability,
    updateStatus,
    doctorlist_user
}


// Clinic 
// 1)name 
// 2)address same table
// 3)phone clinic
// 4)email clinic 
// 5)image clinic, 
// 6)description


// clicninc dpct 
// 1)dr id
// 2)clinic id
// 3) monday start dateandend , monday end
