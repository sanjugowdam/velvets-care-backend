const {
    Users,
    Otps,
    Files
} = require('../models')
const {
    Op
} = require('sequelize')
const {
    OTPFunctions, JWTFunctions, GoogleAuthFunctions
} = require('../helpers')

const { TwilioFunctions, FileFunctions } = require('../helpers')
const DEMO_OTP = '1234'

const request_otp_login = async (req, res) => {
    try {

        const { phone } = req.payload;
        const user = await Users.findOne({
            where: {
                phone: phone
            },
            raw: true
        })
        const otp = await OTPFunctions.getOTPByLength(4);
        console.log("login otp:", otp);
        if (!user) {
            throw new Error('User not found');
        }
        const otpCode = await Otps.create({
            otp: otp,
            otp_time: Date.now()
        })
        // const sent = await TwilioFunctions.sendOtpViaTwilio(phone, otpCode.otp);
        // if (!sent) {
        //     throw new Error('OTP not sent');
        // }
        await Users.update({
            otp_id: otpCode.id
        }, {
            where: {
                id: user.id
            }
        })
        return res.response({
            success: true,
            otp: otpCode.otp,
            message: 'OTP sent successfully',
        })
    }
    catch (error) {
        console.log(error);
        return res.response({
            success: true,
            message: error.message,
        })

    }
}

const request_otp_register = async (req, res) => {
    try {
        const { phone, name } = req.payload;
        const user = await Users.findOne({
            where: {
                phone: phone
            },
            raw: true
        })
        const otp = await OTPFunctions.getOTPByLength(4);
        console.log("register otp:", otp);
        if (user) {
            throw new Error('User already exists');
        }
        const otpCode = await Otps.create({
            otp: otp,
            otp_time: Date.now()
        })
        // const sent = await TwilioFunctions.sendOtpViaTwilio(phone, otpCode.otp);
        // if (!sent) {
        //     throw new Error('OTP not sent');
        // }
        await Users.create({
            phone: phone,
            name: name,
            otp_id: otpCode.id
        })
        return res.response({
            success: true,
            otp: otpCode.otp,
            message: 'OTP sent successfully',
        })
    }
    catch (error) {
        console.log(error);
        return res.response({
            success: true,
            message: error.message,
        })

    }
}
const verify_otp = async (req, res) => {
  try {
    const { phone, otp } = req.payload;

    const user = await Users.findOne({ where: { phone }, raw: true });
    if (!user) {
     throw new Error('User not found');
    }

    // If DEMO_OTP is used
    if (otp == DEMO_OTP) {
      const payload = {
        user_id: user.id,
        phone: user.phone,
        name: user.name,
      };
      const refresh_token = await JWTFunctions.generateToken(payload, '30d');
      const access_token = await JWTFunctions.generateToken(payload, '1d');

      await Users.update(
        { access_token, refresh_token },
        { where: { id: user.id } }
      );

      return res.response({
        success: true,
        message: 'OTP verified successfully (demo)',
        data: { access_token, refresh_token, user: payload },
      }).code(200);
    }

    // Real OTP verification
    const otpCode = await Otps.findOne({
      where: { id: user.otp_id },
      raw: true,
    });

    if (!otpCode) {
      throw new Error('OTP not found');
    }

    const otpTime = new Date(otpCode.otp_time);
    const currentTime = new Date();
    const diffInMinutes = (currentTime - otpTime) / 1000 / 60;

    if (diffInMinutes > 10) {
       throw new Error('OTP expired');
    }

    if (otpCode.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    const payload = {
      user_id: user.id,
      phone: user.phone,
      name: user.name,
    };
    const refresh_token = await JWTFunctions.generateToken(payload, '30d');
    const access_token = await JWTFunctions.generateToken(payload, '1d');

    await Users.update(
      { access_token, refresh_token },
      { where: { id: user.id } }
    );

    await Otps.destroy({ where: { id: user.otp_id } });

    return res.response({
      success: true,
      message: 'OTP verified successfully',
      data: { access_token, refresh_token, user: payload },
    }).code(200);

  } catch (error) {
    console.error(error);
    return res.response({
      success: false,
      message: error.message,
    }).code(200);
  }
};


const validateusersession = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        console.log(session_user, "session checker");
        const user = await Users.findOne({
            where: { id: session_user.user_id, access_token: req.headers['authorization'] },
            raw: true,
            attributes: ['id', 'name', 'phone'],
        },
        )
        if (!user) {
            throw new Error('Session expired');
        }
        return res.response({
            success: true,
            message: 'Session validated',
            data: user,
        }).code(200);
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

const logout = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { refresh_token } = req.payload;
        if (!refresh_token) {
            throw new Error('Refresh token required');
        }
        const decoded = JWTFunctions.verifyToken(refresh_token);
        const user = await Users.findOne({ where: { id: decoded.user_id } });
        if (!user) {
            throw new Error('User not found');
        }

        await Users.update({
            access_token: null,
            refresh_token: null,
        }, {
            where: {
                id: session_user.user_id
            }
        })
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
}

const update_user = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { name, phone, gender, profile_image, dob} = req.payload;
        const user = await Users.findOne({ where: { id: session_user.user_id} });
        if (!user) {
            throw new Error('User not found');
        }
        const storePath = await FileFunctions.uploadFile(req, profile_image, 'uploads/profiles/');
        const uploadedImage = await FileFunctions.uploadFile(req, image, storePath);
        const uploaded_files = await Files.create({
            file_url: uploadedImage.file_url,
            extension: uploadedImage.extension,
            original_name: uploadedImage.original_name,
            size: uploadedImage.size
        })
        await Users.update({
            name: name,
            phone: phone,
            gender: gender,
            dob: dob,
            profile_image_id: uploaded_files.id,
        }, {
            where: {
                id: session_user.user_id
            }
        })
        return res.response({
            success: true,
            message: 'User updated successfully',
        }).code(200);
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}
const user_refresh_token = async (req, res) => {
    try {
        const { refresh_token } = req.headers;
        if (!refresh_token) {
            throw new Error('Refresh token required');
        }
        const decoded = JWTFunctions.verifyToken(refresh_token);
        const user = await Users.findOne({ where: { id: decoded.user_id } });
        if (!user) {
            throw new Error('User not found');
        }
        const payload = {
            user_id: user.id,
            phone: user.phone,
            name: user.name
        }
        const access_token = await JWTFunctions.generateToken( payload , '1d');
        const new_refresh_token = await JWTFunctions.generateToken( payload , '30d');
        await Users.update({
            access_token: access_token,
            refresh_token: new_refresh_token
        }, {
            where: {
                id: decoded.user_id
            }
        }
        )
        return res.response({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                access_token: access_token,
                refresh_token: new_refresh_token,
                user: payload
            }
        }).code(200);
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

const getusers = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const {page, limit, searchquery} = req.query;
       let  filter = {};
        if (searchquery) {
            filter = {
                [Op.or]: [
                    { name: { [Op.like]: `%${searchquery}%` } },
                    { phone: { [Op.like]: `%${searchquery}%` } },
                ],
            };
        }
        const user_count = await Users.count({
            where: filter
        });
        const users = await Users.findAll({
            where: filter,
            limit: limit,
            offset: (page - 1) * limit,
        });
        return res.response({
            success: true,
            message: 'Users fetched successfully',
            data: users,
            total: user_count,
            page: page,
            limit: limit,
        }).code(200);

        } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}
const googleSignIn = async (request, h) => {
    try {
        const { token } = request.payload;
      const userData = await GoogleAuthFunctions.verifyGoogleToken(token);
  
      let user = await User.findByEmail(userData.email);
  
      let accessToken, refreshToken;
  
      // Upload profile image only if user does not exist
      if (!user) {
        const profileImage = await FileFunctions.uploadFile(request, userData.picture, 'uploads/profiles/');
        const uploadedImage = await FileFunctions.uploadFile(req, image, profileImage);

        const file = await Files.create({
          file_url: uploadedImage.file_url,
          extension: uploadedImage.extension,
          original_name: uploadedImage.original_name,
          size: uploadedImage.size
        });
  
        accessToken = JWTFunctions.generateAccessToken(userData.email, userData.name);
        refreshToken = JWTFunctions.generateRefreshToken(userData.email, userData.name);
  
       const user
        = await Users.create({ 
          email: userData.email,
          name: userData.name,
          access_token: accessToken,
          refresh_token: refreshToken,
          profile_image_id: file.id
        });
  
      } else {
        // Generate new tokens
        accessToken = JWTFunctions.generateAccessToken(user.email, user.name);
        refreshToken = JWTFunctions.generateRefreshToken(user.email, user.name);
  
        await Users.update({
          access_token: accessToken,
          refresh_token: refreshToken
        }, {
          where: {
            id: user.id
          }
        })
      }
      return h.response({
        message: 'Login successful',
        user,
        accessToken,
        refreshToken,
      }).code(200);
  
    } catch (err) {
      console.error(err);
      return h.response({ 
        success: false,
        message: err.message
      }).code(401);
    }
  };
  

module.exports = {
    request_otp_login, 
    request_otp_register,                                               
    verify_otp,
    validateusersession,
    logout,
    update_user,
    user_refresh_token,
    getusers,
 googleSignIn ,


    
}