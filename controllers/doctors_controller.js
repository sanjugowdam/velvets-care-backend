const {
    Doctors,
    Doctorsavailability,
    Adresses,
    Otps,
    Files,
    Appointments
} = require('../models')
const {
    Op,
    fn,
    col,
    where
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions
} = require('../helpers')
const fs = require('fs')

const { TwilioFunctions, FileFunctions } = require('../helpers');
const { ComplianceInquiriesContextImpl } = require('twilio/lib/rest/trusthub/v1/complianceInquiries');
const { default: ClientCapability } = require('twilio/lib/jwt/ClientCapability');
const { off } = require('../config/mailer');

const updateBasicDetails = async (req, h) => {
    try {
         const transaction = await sequelize.transaction();
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {
            full_name, gender, date_of_birth, phone, email,
            specialization, years_of_experience, registration_number,
            registration_certificate, medical_degree_certificate,
            consultation_fee, consultation_modes, languages_spoken, profile_image, government_id, pan_card
        } = req.payload;
        console.log(req.payload, "payload");
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
        let govFileId = null;
        let profileFileId = null;
        let panFileId = null;

        if (profile_image) {
            const uploadedfile = await FileFunctions.uploadToS3(profile_image.filename,  'uploads/profile_images', fs.readFileSync(profile_image.path));
            const profileFile = await Files.create({
                file_url: uploadedfile.key,
                extension: uploadedfile.key.split('.').pop(),
                original_name: uploadedfile.key,
                size: fs.statSync(profile_image.path).size
            }, { transaction });
            profileFileId = profileFile.id;
        }

        if (government_id) {
            const uploadedfile = await FileFunctions.uploadToS3(government_id.filename,  'uploads/government_ids', fs.readFileSync(government_id.path));
            const govFile = await Files.create({
                file_url: uploadedfile.key,
                extension: uploadedfile.key.split('.').pop(),
                original_name: uploadedfile.key,
                size: fs.statSync(government_id.path).size
            }, { transaction });
            govFileId = govFile.id;
        }

        if (pan_card) {
            const uploadedfile = await FileFunctions.uploadToS3(pan_card.filename,  'uploads/pan_cards', fs.readFileSync(pan_card.path));
            const panFile = await Files.create({
                file_url: uploadedfile.key,
                extension: uploadedfile.key.split('.').pop(),
                original_name: uploadedfile.key,
                size: fs.statSync(pan_card.path).size
            }, { transaction });
            panFileId = panFile.id;
        }

        if (registration_certificate) {
            const uploadedfile = await FileFunctions.uploadToS3(registration_certificate.filename,  'uploads/registration_certificates', fs.readFileSync(registration_certificate.path));
            const regFile = await Files.create({
                file_url: uploadedfile.key,
                extension: uploadedfile.key.split('.').pop(),
                original_name: uploadedfile.key,
                size: fs.statSync(registration_certificate.path).size
            }, { transaction });
            regCertFileId = regFile.id;
        }

        if (medical_degree_certificate) {
            const uploadedfile = await FileFunctions.uploadToS3(medical_degree_certificate.filename,  'uploads/medical_degree_certificates', fs.readFileSync(medical_degree_certificate.path));
            const degreeFile = await Files.create({
                file_url: uploadedfile.key,
                extension: uploadedfile.key.split('.').pop(),
                original_name: uploadedfile.key,
                size: fs.statSync(medical_degree_certificate.path).size
            }, { transaction });
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
            consultation_modes: JSON.stringify(consultation_modes),
            languages_spoken: JSON.stringify(languages_spoken),
            profile_image_id: profileFileId,
            government_id: govFileId,
            pan_card_id: panFileId
        });
        await transaction.commit();
        return h.response({
            success: true,
            message: 'Basic details updated successfully',
            data: doctor
        }).code(201);
        
    } catch (err) {
        await transaction.rollback();
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
        else {
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
                }
            });

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
            },
            raw: true,
            nest: true,
            mapToModel: true
        });
      const data = doctor.map(async (doc) => ({
            profile_image: doc.profile_image?.files_url
                ? await FileFunctions.getFromS3(doc.profile_image.files_url)
                : null,

            government_id: doc.government_id_file?.files_url
                ? await FileFunctions.getFromS3(doc.government_id_file.files_url)
                : null,

            pan_card: doc.pan_card_file?.files_url
                ? await FileFunctions.getFromS3(doc.pan_card_file.files_url)
                : null,

            registration_certificate: doc.registration_certificate_file?.files_url
                ? await FileFunctions.getFromS3(doc.registration_certificate_file.files_url)
                : null,

            medical_degree_certificate: doc.medical_degree_certificate_file?.files_url
                ? await FileFunctions.getFromS3(doc.medical_degree_certificate_file.files_url)
                : null
        }));

        return h.response({
            success: true,
            message: 'Doctor list fetched successfully',
            data: await Promise.all(data)
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: 'Error finding doctor'
        }).code(200);
    }
};

const doctorlist = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }

        const { specialization, years_of_experience, searchquery, page, limit } = req.query;
        let offset;
        if (page && limit) {
            offset = (page - 1) * limit;
        }

        let filter = {};
        if (searchquery) {
            filter = {
                [Op.or]: [
                    { full_name: { [Op.like]: `%${searchquery}%` } },
                    { phone: { [Op.like]: `%${searchquery}%` } },
                ],
            };
        }

        if (specialization) {
            filter = { ...filter, specialization };
        }

        if (years_of_experience) {
            filter = { ...filter, years_of_experience };
        }

        if (page && limit) {
            const doctor_count = await Doctors.count({ where: filter });

            const doctors = await Doctors.findAll({
                attributes: { exclude: ['access_token', 'refresh_token'] },
                include: [
                    { model: Adresses },
                    { model: Doctorsavailability },
                    { model: Files, as: 'registration_certificate' },
                    { model: Files, as: 'medical_degree_certificate' },
                    { model: Files, as: 'profile_image' },
                    { model: Files, as: 'government_id_file' },
                    { model: Files, as: 'pan_card_file' },
                ],
                where: filter,
                limit: parseInt(limit),
                offset: offset,
            });

            return h.response({
                success: true,
                message: 'Doctors fetched successfully',
                data: doctors,
                total: doctor_count,
            }).code(200);

        } else {
            // If no pagination, return minimal info
            const basicDoctors = await Doctors.findAll({
                attributes: ['id', 'full_name', 'phone', 'email', 'consultation_modes'],
                where: filter,
            });

            return h.response({
                success: true,
                message: 'Basic doctor list fetched successfully',
                data: basicDoctors,
            }).code(200);
        }

    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: err.message,
        }).code(200);
    }
};


const fetch_single_doctor = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id } = req.params;
        const doctor = await Doctors.findOne({
            where: { id: doctor_id }
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return h.response({
            success: true,
            message: 'Doctor fetched successfully',
            data: doctor
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: err.message
        }).code(200);
    }
}

const fetch_popular_doctors = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }

        // Count how many completed appointments each doctor has
        const popularDoctors = await Appointments.findAll({
            where: { status: 'completed' },
            attributes: [
                'doctor_id',
                [fn('COUNT', col('doctor_id')), 'completed_count']
            ],
            group: ['doctor_id'],
            order: [[fn('COUNT', col('doctor_id')), 'DESC']],
            limit: 10, // top 10 doctors
            raw: true
        });

        if (!popularDoctors.length) {
            return h.response({
                success: true,
                message: 'No popular doctors found',
                data: []
            }).code(200);
        }

        // Extract doctor IDs
        const doctorIds = popularDoctors.map(d => d.doctor_id);

        // Fetch doctor details
        const doctors = await Doctors.findAll({
            where: { id: { [Op.in]: doctorIds } },
            include: [
                {
                    model: Files,
                    as: 'profile_image',
                },

            ],
            raw: true,
            nest: true
        });

        // Merge appointment counts with doctor details
        const merged = doctors.map(doc => {
            const count = popularDoctors.find(p => p.doctor_id === doc.id)?.completed_count || 0;
            return { ...doc, completed_appointments: count };
        });

        return h.response({
            success: true,
            message: 'Popular doctors fetched successfully',
            data: merged
        }).code(200);

    } catch (err) {
        console.error('Error fetching popular doctors:', err);
        return h.response({
            success: false,
            message: err.message
        }).code(400);
    }
};

const updateDoctoreDetailsByAdmin = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id } = req.params;
        const {
            full_name, gender, date_of_birth, phone, email,
            specialization, years_of_experience, registration_number,
            registration_certificate, medical_degree_certificate,
            consultation_fee, consultation_modes, languages_spoken, profile_image, government_id, pan_card
        } = req.payload;
        
        const doctor = await Doctors.findOne({
            where: { id: doctor_id }
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        if (profile_image) {
            const uploadedfile = await FileFunctions.uploadFile(req, profile_image, 'uploads/profile_images/');
            const profileFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            profileFileId = profileFile.id;
        }

        if (government_id) {
            const uploadedfile = await FileFunctions.uploadFile(req, government_id, 'uploads/government_ids/');
            const govFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            govFileId = govFile.id;
        }

        if (pan_card) {
            const uploadedfile = await FileFunctions.uploadFile(req, pan_card, 'uploads/pan_cards/');
            const panFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            panFileId = panFile.id;
        }

        if (registration_certificate) {
            const uploadedfile = await FileFunctions.uploadFile(req, registration_certificate, 'uploads/registration_certificates/');
            const regFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            regCertFileId = regFile.id;
        }

        if (medical_degree_certificate) {
            const uploadedfile = await FileFunctions.uploadFile(req, medical_degree_certificate, 'uploads/medical_degree_certificates/');
            const degreeFile = await Files.create({
                file_url: uploadedfile.file_url,
                extension: uploadedfile.extension,
                original_name: uploadedfile.original_name,
                size: uploadedfile.size
            });
            degreeCertFileId = degreeFile.id;
        }

    
        await Doctors.update({
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
            consultation_modes: JSON.stringify(consultation_modes),
            languages_spoken: JSON.stringify(languages_spoken),
            profile_image_id: profileFileId,
            government_id: govFileId,
            pan_card_id: panFileId
        }, {
            where: {
                id: doctor_id
            }
        });

        return h.response({
            success: true,
            message: 'Doctor details updated successfully',
            data: doctor
        }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: err.message
        });
    }
};

const deleteDoctor = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id } = req.params;
        const doctor = await Doctors.findOne({
            where: { id: doctor_id }
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        await doctor.destroy();
        return h.response({
            success: true,
            message: 'Doctor deleted successfully',
            data: doctor
        }).code(200);
    
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: err.message
        });
    }
};

const CheckDoctorSlotsByAdmin = async (req, h) => {
  try {
      const session_user = req.headers.user;
      if (!session_user) {
          throw new Error('Session expired');
      }
      const { doctor_id } = req.params;
      const doctor = await Doctorsavailability.findOne({
          where: { id: doctor_id }
      });
      if (!doctor) {
          throw new Error('Doctor not found');
      }
      const slots = await Doctorsavailability.findAll({
          where: { doctor_id }
      });
      return h.response({
          success: true,
          data: slots
      }).code(200);
  } catch (error) {
      console.error(error);
      return h.response({
          success: false,
          message: error.message
      });
    
  }
}

module.exports = {
    updateBasicDetails,
    updateAddress,
    updateAvailability,
    updateStatus,
    doctorlist_user,
    doctorlist,
    fetch_single_doctor,
    fetch_popular_doctors,
    updateDoctoreDetailsByAdmin,
    deleteDoctor,
    CheckDoctorSlotsByAdmin
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
