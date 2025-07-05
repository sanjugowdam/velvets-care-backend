const {
    Files,
    Appointments,
    Users,
    Doctors,
    Doctorsavailability

} = require('../models')
const {
    Op
} = require('sequelize')
const {
    FileFunctions, JWTFunctions, RazorpayFunctions, AgoraFunctions
} = require('../helpers');



const precheckAndCreateOrder = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const { doctor_id, appointment_date, appointment_time } = req.payload;
        console.log(doctor_id, appointment_date, appointment_time);
        console.log(new Date(appointment_date));
        console.log(new Date(appointment_date).toLocaleDateString());
        const user = await Users.findOne({ where: { id: session_user.user_id } });
        const doctor = await Doctors.findOne({
            where:
                { id: doctor_id },
            raw: true
        });
        if (!user || !doctor) throw new Error('Invalid user or doctor');

        const appointmentDate = new Date(appointment_date);
        const appointmentDay = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });
        const appointmentTime = appointment_time.slice(0, 5);

        const availability = await Doctorsavailability.findOne({
            where: {
                doctor_id,
                day: appointmentDay,
                start_time: { [Op.lte]: appointmentTime },
                end_time: { [Op.gte]: appointmentTime }
            }
        });

        if (!availability) throw new Error('Doctor is not available at this time');

        const existingAppointment = await Appointments.findOne({
            where: {
                doctor_id,
                appointment_date,
                appointment_time
            }
        });

        if (existingAppointment) throw new Error('Slot already booked');
        const appointmentDate_date = new Date(appointment_date);
        appointmentDate_date.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDate <= today) {
            throw new Error('Appointments must be booked for a future date, not today or past');
        }

        const amount = doctor.consultation_fee || 500;
        const order = await RazorpayFunctions.createRazorpayOrder(amount);

        return res.response({
            success: true,
            message: 'Doctor available. Proceed to payment.',
            data: order
        });
    } catch (error) {
        console.log(error);
        return res.response({ success: false, message: error.message }).code(200);
    }
};

const confirmAppointment = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const {
            doctor_id,
            appointment_date,
            appointment_time,
            reason,
            status,
            order_id,
            payment_id,
            payment_signature,
            consultation_fee,
            consultation_modes
        } = req.payload;
        //    const captured_payment = await RazorpayFunctions.capturePayment(consultation_fee, payment_id);
        //    console.log(captured_payment);
        //    if(!captured_payment) throw new Error('Razorpay payment capture failed');
        const appointment = await Appointments.create({
            doctor_id,
            patient_id: session_user.user_id,
            appointment_date,
            appointment_time,
            reason,
            status: 'approved',
            payment_id,
            order_id,
            payment_signature,
            payment_status: 'paid',
            consultation_fee,
            consultation_modes
        });
        const doctor = await Doctors.findOne({ where: { id: doctor_id } });
        const fee = doctor.consultation_fee || 500;

        await Doctors.update(
            { total_earnings: (doctor.total_earnings || 0) + fee },
            { where: { id: doctor_id } }
        );

        return res.response({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message
        }).code(200);
    }
};


const getDoctorAppointments = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user || !session_user.user_id) {
            throw new Error('Session expired or invalid user');
        }

        const doctor_id = session_user.user_id;
        const { status, date } = req.query;

        const filters = { doctor_id };

        if (status) {
            filters.status = status;
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            filters.appointment_date = {
                [Op.between]: [startOfDay, endOfDay]
            };
        }

        const appointments = await Appointments.findAll({
            where: filters,
            order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']]
        });

        return res.response({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments
        });
    } catch (error) {
        console.error('Fetch doctor appointments error:', error);
        return res.response({
            success: false,
            message: error.message || 'Failed to fetch appointments'
        }).code(200);
    }
};


const DoctorApproval = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const doctor_id = session_user.user_id;
        const appointmentId = req.params.id;
        const appointment = await Appointments.findByPk(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        if (appointment.doctor_id !== doctor_id) {
            throw new Error('Unauthorized: This is not your appointment');
        }
        if (appointment.status !== 'pending') {
            throw new Error(`Only pending appointments can be approved. Current status: ${appointment.status}`);
        }
        // Update status to approved
        await Appointments.update({
            status: 'approved'
        }
            , { where: { id: appointmentId } });

        return h.response({
            success: true,
            message: 'Appointment approved successfully',
            data: appointment
        });
    } catch (error) {
        console.error(error);
        return h.response({
            success: false,
            message: error.message
        }).code(200);
    }
};

const doctoreject = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const doctor_id = session_user.user_id;
        const appointmentId = req.params.id;
        const {  cancel_reason } = req.payload;

        const appointment = await Appointments.findByPk(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        if (appointment.doctor_id !== doctor_id) {
            throw new Error('Unauthorized: This is not your appointment');
        }

        if (appointment.status !== 'pending') {
            throw new Error(`Only pending appointments can be rejected. Current status: ${appointment.status}`);
        }
        // Update status to rejected
        await appointment.update({
            status: 'rejected',
            cancel_reason,
            cancel_by: 'doctor'

        });
        return h.response({
            success: true,
            message: 'Appointment rejected successfully',
            data: appointment
        });
    } catch (error) {
        console.error(error);
        return h.response({
            success: false,
            message: error.message
        }).code(200);
    }
}

const cancelAppointmentByUser = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const user_id = session_user.user_id;
        const appointmentId = req.params.id;
        const {  cancel_reason } = req.payload;

        const appointment = await Appointments.findByPk(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }

        if (appointment.patient_id !== user_id) {
            throw new Error('Unauthorized: This is not your appointment');
        }

        // ✅ Prevent canceling on the same day
        const today = new Date().toISOString().split('T')[0];
        if (appointment.appointment_date === today) {
            throw new Error('Cannot cancel appointment on the same day');
        }

        // ✅ Prevent duplicate cancellation
        if (appointment.status === 'cancelled') {
            throw new Error('Appointment is already cancelled');
        }

        // ✅ Cancel the appointment
        await appointment.update({
            status: 'cancelled',
            cancel_reason: cancel_reason,
            cancel_by: 'patient'
        });

        return h.response({
            success: true,
            message: 'Appointment cancelled successfully',
            data: appointment
        });

    } catch (error) {
        console.error(error);
        return h.response({
            success: false,
            message: error.message
        }).code(200);
    }
};

const getadminAppointments = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');
        const { page, limit, searchquery, doctor_id, status, date, patient_id } = req.query;
        let filter = {};
        if (doctor_id) {
            filter = {
                ...filter,
                doctor_id: doctor_id
            }
        }
        if (status) {
            filter = {
                ...filter,
                status: status
            }
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            filter = {
                ...filter,
                appointment_date: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            };
        }
        if (patient_id) {
            filter = {
                ...filter,
                patient_id: patient_id
            }
        }
        const user_count = await Appointments.count({
            where: filter
        });
        const appointments = await Appointments.findAll({
            where: filter,
            limit: limit,
            offset: (page - 1) * limit,
            order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']],
        });
        return res.response({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments,
            total: user_count,
            page: page,
            limit: limit
        }).code(200);
    } catch (error) {
        console.error(error);
        return res.response({
            success: false,
            message: error.message
        }).code(200);
    }
}
const getRtcToken = async (req, h) => {
  try {
    const session_user = req.headers.user;
    if (!session_user) throw new Error('Session expired');

    const appointmentId = req.params.id;
    const userId = session_user.user_id;

    const appointment = await Appointments.findByPk(appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.status !== 'approved') throw new Error('Appointment not approved');

    if (![appointment.doctor_id, appointment.patient_id].includes(userId)) {
      throw new Error('Unauthorized access');
    }

    const channelName = `appointment_${appointmentId}`;
    const token = AgoraFunctions.generateRtcToken(channelName, userId);

    return h.response({
      success: true,
      token,
      channelName,
      uid: userId,
      consultation_mode: appointment.consultation_mode
    });

  } catch (err) {
    console.error(err);
    return h.response({
      success: false,
      message: err.message
    }).code(200);
  }
};
module.exports = {
    precheckAndCreateOrder,
    confirmAppointment,
    cancelAppointmentByUser,
    getadminAppointments,
    getDoctorAppointments,
    doctoreject,
    DoctorApproval,
    getRtcToken
}


// ek Api  ampount  with order id and send to frontend
// when we boojk payment will hit book appoibntnewewnt apio and payumnent id save