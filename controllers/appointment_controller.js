const {
    Files,
    Appointments,
    Users,
    Doctors

} = require('../models')
const {
    Op
} = require('sequelize')
const {
    FileFunctions, JWTFunctions
} = require('../helpers')

const createAppointment = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) {
            throw new Error('Session expired');
        }
        const { doctor_id, appointment_date, appointment_time, time, reason, status } = req.payload;
        const user = await Users.findOne({ where: { id: session_user.user_id } });
        if (!user) {
            throw new Error('User not found');
        }
        const doctor = await Doctors.findOne({ where: { id: doctor_id } });
        if (!doctor) {
            throw new Error('Doctor not found');
        }
        const appointmentDate = new Date(appointment_date);
        const appointmentDay = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Saturday"

        // 2. Extract time (e.g., "14:30") from appointment time string
        const appointmentTime = appointment_time.slice(0, 5); // Assume time passed as "14:30" or "14:30:00"

        // 3. Find availability
        const doctor_availability = await Doctorsavailability.findOne({
            where: {
                doctor_id: req.payload.doctor_id,
                day: appointmentDay,
                start_time: { [Op.lte]: appointmentTime },
                end_time: { [Op.gte]: appointmentTime }
            }
        });

        // 4. Check availability
        if (!doctor_availability) {
            throw new Error('Doctor is not available at this time');
        }

        const existingAppointment = await Appointments.findOne({
            where: {
                doctor_id: req.payload.doctor_id,
                appointment_date: appointment_date,
                [Op.or]: [
                    { appointment_time: { [Op.lte]: appointmentTime } },
                    { appointment_time: { [Op.gte]: appointmentTime } }
                ]
            }
        });

        if (existingAppointment) {
            throw new Error('Doctor is not available at this time');
        }

        const appointment = await Appointments.create({
            doctor_id: doctor_id,
            patient_id: user.id,
            appointment_time: appointment_time,
            appointment_date: appointment_date,
            reason: reason,
            status: status

        });
        return res.response({
            success: true,
            message: 'Appointment created successfully',
            data: appointment
        });
    } catch (error) {
        console.log(error);
        return res.response({
            success: false,
            message: error.message,
        }).code(200);
    }
}

module.exports = {
    createAppointment
}