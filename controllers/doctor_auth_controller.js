
const { Doctors, Otps, Users, Files, Doctorsavailability, Adresses, Specialization } = require('../models');
const {
    OTPFunctions, JWTFunctions, TwilioFunctions
} = require('../helpers')

const DEMO_OTP = '1234'
const doctor_request_otp = async (req, res) => {
    try {
        const { phone } = req.payload;
        const doctor = await Doctors.findOne({
            where: {
                phone: phone
            },
            raw: true
        });

        const otp = await OTPFunctions.getOTPByLength(4);
        console.log("login otp:", otp);
        if (!doctor) {
            const otpCode = await Otps.create({
                otp: otp,
                otp_time: Date.now()
            });

            // const sent = await TwilioFunctions.sendOtpViaTwilio(phone, otpCode.otp);
            // if (!sent) {
            //     throw new Error('OTP not sent');
            // }
            await Doctors.create({
                phone: phone,
                otp_id: otpCode.id
            });

            return res.response({
                success: true,
                otp: otpCode.otp,
                message: 'OTP sent successfully',
            });
        }

        const otpCode = await Otps.create({
            otp: otp,
            otp_time: Date.now()
        });

        // const sent = await TwilioFunctions.sendOtpViaTwilio(phone, otpCode.otp);
        // if (!sent) {
        //     throw new Error('OTP not sent');
        // }

        await Doctors.update({
            otp_id: otpCode.id
        }, {
            where: {
                id: doctor.id
            }
        });

        return res.response({
            success: true,
            message: 'OTP sent successfully',
            otp: otpCode.otp
        });

    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        });
    }
};

const doctor_verify_otp = async (req, res) => {
    try {
        const { phone, otp } = req.payload;
        const doctor = await Doctors.findOne({
            where: { phone },
            raw: true
        });

        if (!doctor) throw new Error('Doctor not found');

        let access_token;
        let refresh_token;
        let payload = {
            doctor_id: doctor.id,
            phone: doctor.phone,
            name: doctor.full_name,
            role: 'DOCTOR'
        };

        if (DEMO_OTP == otp) {
            refresh_token = await JWTFunctions.generateToken(payload, '30d');
            access_token = await JWTFunctions.generateToken(payload, '1d');

            await Doctors.update({
                access_token,
                refresh_token
            }, {
                where: { id: doctor.id }
            });
        } else {
            const otpCode = await Otps.findOne({
                where: { id: doctor.otp_id },
                raw: true
            });

            if (!otpCode) throw new Error('OTP already used or expired');

            const otpTime = new Date(otpCode.otp_time);
            const currentTime = new Date();
            const diffInMinutes = (currentTime - otpTime) / 1000 / 60;

            if (diffInMinutes > 10) {
                return res.response({
                    success: false,
                    message: 'OTP has expired. Please request a new one.',
                });
            }

            if (otpCode.otp != otp) {
                return res.response({
                    success: false,
                    message: 'Invalid OTP',
                });
            }

            refresh_token = await JWTFunctions.generateToken(payload, '30d');
            access_token = await JWTFunctions.generateToken(payload, '1d');

            await Doctors.update({
                access_token,
                refresh_token
            }, {
                where: { id: doctor.id }
            });

            await Otps.destroy({
                where: { id: doctor.otp_id }
            });
        }

        return res.response({
            success: true,
            message: 'OTP verified successfully',
            data: {
                access_token,
                refresh_token,
                doctor: payload,
            }
        });
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        });
    }
};


const doctor_validate_session = async (req, res) => {
    try {
        const session_doctor = req.headers.user;
        if (!session_doctor) {
            throw new Error('Session expired');
        }
        const doctor = await Doctors.findOne({
            where: { id: session_doctor.doctor_id, access_token: req.headers['authorization'] },
            raw: true,
            attributes: ['id', 'full_name', 'phone'],
        });

        if (!doctor) {
            throw new Error('Session expired');
        }

        return res.response({
            success: true,
            message: 'Session validated',
            data: doctor,
        }).code(200);

    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
};

const doctor_logout = async (req, res) => {
    try {
        const session_doctor = req.headers.user;
        if (!session_doctor) {
            throw new Error('Session expired');
        }

        const { refresh_token } = req.payload;
        if (!refresh_token) {
            throw new Error('Refresh token required');
        }

        const decoded = JWTFunctions.verifyToken(refresh_token);
        const doctor = await Doctors.findOne({ where: { id: decoded.doctor_id } });
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        await Doctors.update({
            access_token: null,
            refresh_token: null,
        }, {
            where: {
                id: session_doctor.doctor_id
            }
        });

        return res.response({
            success: true,
            message: 'Logout successful',
        }).code(200);

    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
};

const doctor_update_profile = async (req, res) => {
    try {
        const session_doctor = req.headers.user;
        if (!session_doctor) {
            throw new Error('Session expired');
        }

        const { full_name, phone, email, gender, profile_image, dob } = req.payload;
        const doctor = await Doctors.findOne({ where: { id: session_doctor.doctor_id } });
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const storePath = await FileFunctions.uploadFile(req, profile_image, 'uploads/profiles/');
        const uploadedImage = await FileFunctions.uploadFile(req, profile_image, storePath);

        const uploaded_files = await Files.create({
            file_url: uploadedImage.file_url,
            extension: uploadedImage.extension,
            original_name: uploadedImage.original_name,
            size: uploadedImage.size
        });

        await Doctor.update({
            full_name: full_name,
            phone: phone,
            gender: gender,
            dob: dob,
            email: email,
            profile_image_id: uploaded_files.id,
        }, {
            where: {
                id: session_doctor.doctor_id
            }
        });

        return res.response({
            success: true,
            message: 'Doctor profile updated successfully',
        }).code(200);

    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
};

const doctor_refresh_token = async (req, res) => {
    try {
        const { refresh_token } = req.headers;
        if (!refresh_token) {
            throw new Error('Refresh token required');
        }

        const decoded = JWTFunctions.verifyToken(refresh_token);
        const doctor = await Doctors.findOne({ where: { id: decoded.doctor_id } });
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        const payload = {
            doctor_id: doctor.id,
            phone: doctor.phone,
            name: doctor.full_name
        };

        const access_token = await JWTFunctions.generateToken(payload, '1d');
        const new_refresh_token = await JWTFunctions.generateToken(payload, '30d');

        await Doctor.update({
            access_token: access_token,
            refresh_token: new_refresh_token
        }, {
            where: {
                id: decoded.doctor_id
            }
        });

        return res.response({
            success: true,
            message: 'Doctor token refreshed successfully',
            data: {
                access_token: access_token,
                refresh_token: new_refresh_token,
                doctor: payload
            }
        }).code(200);

    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
};

const getDoctorProfile = async (req, res) => {
    try {
        const session_doctor = req.headers.user;
        if (!session_doctor) {
            throw new Error('Session expired');
        }

        const doctor = await Doctors.findOne({
            where: { id: session_doctor.doctor_id },
            attributes: ['id', 'full_name', 'phone', 'email', 'gender', 'profile_image_id'],
            include: [{
                model: Files,
                as: 'profile_image',
                attributes: ['files_url', 'original_name']
            },
            {
                model: Doctorsavailability,
                attributes: ['id', 'day', 'start_time', 'end_time']
            },
            {
                model: Adresses,
            },
                // {
                //     model: Specialization,
                //     attributes: ['id', 'name']
                // }
            ],
            raw: true
        });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        return res.response({
            success: true,
            message: 'Doctor profile fetched successfully',
            data: doctor
        }).code(200);
    } catch (error) {
        console.error(error);
        return res.response({
            success: false,
            message: error.message
        }).code(500);
    }
};

module.exports = {
    doctor_request_otp,
    doctor_verify_otp,
    doctor_validate_session,
    getDoctorProfile,
    doctor_logout,
    doctor_update_profile,
    doctor_refresh_token,
    getDoctorProfile
};
