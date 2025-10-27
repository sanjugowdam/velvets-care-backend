const {
    Files,
    Appointments,
    Users,
    Doctors,
    Doctorsavailability,
    Specialization

} = require('../models')
const {
    Op
} = require('sequelize')
const {
    FileFunctions, JWTFunctions, RazorpayFunctions, AgoraFunctions
} = require('../helpers');
const Razorpay = require('razorpay');
require('dotenv/config');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});


const precheckAndCreateOrder = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');
        const { doctor_id, appointment_date, appointment_time } = req.payload;
        if (new Date(appointment_date) < new Date()) throw new Error('Booking for past date is not allowed');
        const user = await Users.findOne({ where: { id: session_user.user_id } });
        const doctor = await Doctors.findOne({
            where:
                { id: doctor_id },
            raw: true
        });
        if (!user || !doctor) throw new Error('Invalid user or doctor');

        const appointmentDate = new Date(appointment_date);
        const appointmentDay = appointmentDate.toLocaleDateString('en-IN', { weekday: 'long' });
        const AMPM = appointment_time.includes('AM') ? 'AM' : 'PM';
        const time = appointment_time.split(' ')[0];
        const availability = await Doctorsavailability.findOne({
            where: {
                doctor_id,
                day: appointmentDay
            }
        });
        if (!availability) throw new Error('Doctor is not available at this Date');
        const savedTime = {
            start_time: parseInt(availability.start_time.replace(':', '')),
            end_time: parseInt(availability.end_time.replace(':', '')),
            start_AMPM: availability.start_time.includes('AM') ? 'AM' : 'PM',
            end_AMPM: availability.end_time.includes('AM') ? 'AM' : 'PM'
        }
        if (AMPM == savedTime.start_AMPM && parseInt(time.replace(':', '')) < savedTime.start_time || AMPM == savedTime.end_AMPM && parseInt(time.replace(':', '')) > savedTime.end_time) {
            throw new Error('Doctor is not available at this Time');
        }
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
            status: 'pending',
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
        if (!session_user) {
            throw new Error('Session expired');
        }
        const doctor_id = session_user.doctor_id;
        if (!doctor_id) {
            throw new Error('Doctor ID is required');
        }
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
            include: [{
                model: Users,
            }],
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

        const doctor_id = session_user.doctor_id;
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
       const updatedAppointment = await Appointments.update({
            status: 'approved'
        }, { where: { id: appointmentId } });

        return h.response({
            success: true,
            message: 'Appointment approved successfully',
            data: updatedAppointment
        });
    } catch (error) {
        console.error(error);
        return h.response({
            success: false,
            message: error.message
        }).code(200);
    }
};

const UpdateAppointmentStatus = async (req, h) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const doctor_id = session_user.doctor_id;
       const {appointmentId} = req.params;
        const { status } = req.payload;

        const appointment = await Appointments.findByPk(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        if (appointment.doctor_id !== doctor_id) {
            throw new Error('Unauthorized: This is not your appointment');
        }
        if (appointment.status !== 'approved') {
            throw new Error(`Only approved appointments can have status updated. Current status: ${appointment.status}`);
        }
        if (!['completed', 'no_show'].includes(status)) {
            throw new Error('Invalid status. Allowed values are: completed, no_show');
        }
        // Update status
        await appointment.update({ status });
        return h.response({
            success: true,
            message: 'Appointment status updated successfully',
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

        const doctor_id = session_user.doctor_id;
        const appointmentId = req.params.id;
        const { cancel_reason } = req.payload;

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
        const { cancel_reason } = req.payload;

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
        if (!page || !limit) {
            throw new Error('Page and limit are required');
        }
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
            include: [{
                model: Users,
                attributes: ['id', 'name', 'email', 'phone']
            }, {
                model: Doctors,
                attributes: {
                    exclude: ['access_token', 'otp_id', 'refresh_token']
                },
                include: [{
                    model: Files,
                    as: 'profile_image',
                },
                {
                    model: Specialization,
                }]

            }]
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
        const userId = session_user.doctor_id || session_user.user_id; // Use doctor_id for doctors, user_id for patients

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

const getUserAppointments = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');
        const user_count = await Appointments.count({
            where: {
                patient_id: session_user.user_id
            }
        });
        const appointments = await Appointments.findAll({
            where: {
                patient_id: session_user.user_id
            },
            include: [{
                model: Doctors,
            }],
            order: [['appointment_date', 'ASC'], ['appointment_time', 'ASC']],
        });
        return res.response({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments,
            total: user_count,
        }).code(200);
    } catch (error) {
        console.error(error);
        return res.response({
            success: false,
            message: error.message
        }).code(200);
    }
}

const checkDoctorAvailability = async (req, res) => {
    try {
        // 1️⃣  Auth / session
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        // 2️⃣  Validate payload
        const { doctor_id, appointment_date, appointment_time } = req.payload;
        if (!doctor_id || !appointment_date || !appointment_time) {
            throw new Error('doctor_id, appointment_date and appointment_time are required');
        }
        if (new Date(appointment_date) < new Date()) {
            throw new Error('Booking for past date is not allowed');
        }

        // 3️⃣  Look‑ups
        const user = await Users.findByPk(session_user.user_id);
        const doctor = await Doctors.findByPk(doctor_id, { raw: true });
        if (!user || !doctor) throw new Error('Invalid user or doctor');

        // 4️⃣  Day / time translation
        const appointmentDate = new Date(appointment_date);
        const appointmentDay = appointmentDate.toLocaleDateString('en-IN', { weekday: 'long' });
        const ampm = appointment_time.includes('AM') ? 'AM' : 'PM';
        const plainTime = appointment_time.split(' ')[0];          // "10:30"

        // 5️⃣  Doctor’s weekly availability
        const availability = await Doctorsavailability.findOne({
            where: { doctor_id, day: appointmentDay }
        });
        if (!availability) throw new Error('Doctor is not available on this day');

        const saved = {
            start: parseInt(availability.start_time.replace(':', '')),   // 930
            end: parseInt(availability.end_time.replace(':', '')),     // 1230
            startAMPM: availability.start_time.includes('AM') ? 'AM' : 'PM',
            endAMPM: availability.end_time.includes('AM') ? 'AM' : 'PM'
        };

        const requested = parseInt(plainTime.replace(':', ''));            // 1030
        const outsideWindow =
            (ampm === saved.startAMPM && requested < saved.start) ||
            (ampm === saved.endAMPM && requested > saved.end);

        if (outsideWindow) throw new Error('Doctor is not available at this time');

        // 6️⃣  Collision check
        const existing = await Appointments.findOne({
            where: { doctor_id, appointment_date, appointment_time }
        });
        if (existing) throw new Error('Slot already booked');

        // ✅  All good – return success
        return res.response({
            success: true,
            message: 'Doctor is available for this slot'
        });

    } catch (err) {
        console.log(err);
        return res.response({
            success: false,
            message: err.message
        }).code(200);
    }
};

const getDoctorAvailableTimeSlots = async (req, res) => {
    try {
        // 1️⃣ Auth
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        // 2️⃣ Payload validation
        const { doctor_id, appointment_date } = req.payload;
        if (!doctor_id || !appointment_date) {
            throw new Error('doctor_id and appointment_date are required');
        }

        // 3️⃣ Parse date safely
        let appointmentDate;
        if (appointment_date.includes('/')) {
            const [day, month, year] = appointment_date.split('/');
            appointmentDate = new Date(`${year}-${month}-${day}`);
        } else {
            appointmentDate = new Date(appointment_date);
        }

        if (appointmentDate < new Date()) {
            throw new Error('Past date not allowed');
        }

        // 4️⃣ Lookups
        const user = await Users.findByPk(session_user.user_id);
        if (session_user.role != 'ADMIN' && !user) throw new Error('Invalid user')
        const doctor = await Doctors.findByPk(doctor_id, { raw: true });
        if (!doctor) throw new Error('Invalid doctor');

        // 5️⃣ Translate weekday
        const appointmentDay = appointmentDate.toLocaleDateString('en-IN', { weekday: 'long' });

        // 6️⃣ Get doctor availability
        const availability = await Doctorsavailability.findOne({
            where: { doctor_id, day: appointmentDay }
        });
        if (!availability) throw new Error('Doctor is not available on this day');

        const startTimeStr = availability.start_time;
        const endTimeStr = availability.end_time;

        // 7️⃣ Convert time string to date
        const timeToDate = (timeStr) => {
            const [time, modifier] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            const date = new Date(appointmentDate);
            date.setHours(hours);
            date.setMinutes(minutes);
            date.setSeconds(0);
            return date;
        };

        const formatAMPM = (date) => {
            let hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const paddedMinutes = minutes.toString().padStart(2, '0');
            return `${hours}:${paddedMinutes} ${ampm}`;
        };

        const start = timeToDate(startTimeStr);
        const end = timeToDate(endTimeStr);

        // 8️⃣ Preload all booked appointments
        const allAppointments = await Appointments.findAll({
            where: {
                doctor_id,
                appointment_date
            },
            raw: true
        });
        const bookedTimes = new Set(allAppointments.map(a => a.appointment_time));

        // 9️⃣ Generate slots
        const slots = [];
        let current = new Date(start);
        while (current < end) {
            const next = new Date(current.getTime() + 30 * 60000);
            const slotStart = formatAMPM(current);
            const slotEnd = formatAMPM(next);

            slots.push({
                start: slotStart,
                end: slotEnd,
                is_available: !bookedTimes.has(slotStart)
            });

            current = next;
        }

        // 🔟 Final response
        return res.response({
            success: true,
            date: appointment_date,
            day: appointmentDay,
            start_time: startTimeStr,
            end_time: endTimeStr,
            slots
        });

    } catch (err) {
        console.error(err);
        return res.response({
            success: false,
            message: err.message
        }).code(200);
    }
};

const getTodaysAppointmentsDoctor = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user) throw new Error('Session expired');

        const doctor = await Doctors.findOne({ where: { id: session_user.doctor_id }, raw: true });
        if (!doctor) throw new Error('Invalid doctor');

        // Format today’s date as "MM-DD-YYYY"
        const today = new Date();
        const formattedToday = `${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}-${today.getFullYear()}`;

        const appointments = await Appointments.findAll({
            where: {
                doctor_id: doctor.id,
                appointment_date: formattedToday
            },
            include: [
                {
                    model: Users,
                    attributes: {
                        exclude: ['access_token', 'refresh_token', 'otp_id']
                    },
                    include: [
                        {
                            model: Files,
                        }
                    ]
                }
            ]

        });

        return res.response({
            success: true,
            message: 'Appointments fetched successfully',
            data: appointments
        }).code(200);

    } catch (err) {
        console.error(err);
        return res.response({
            success: false,
            message: err.message
        }).code(200);
    }
};


const adminCheckDoctorSlot = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user || session_user.role !== 'ADMIN') throw new Error('Unauthorized access');

        const { doctor_id, appointment_date, appointment_time } = req.payload;
        if (!doctor_id || !appointment_date || !appointment_time)
            throw new Error('doctor_id, appointment_date and appointment_time are required');

        if (new Date(appointment_date) < new Date())
            throw new Error('Booking for past date is not allowed');

        const doctor = await Doctors.findByPk(doctor_id);
        if (!doctor) throw new Error('Invalid doctor');

        // Convert date to day of week
        const appointmentDay = new Date(appointment_date).toLocaleDateString('en-IN', { weekday: 'long' });
        const ampm = appointment_time.includes('AM') ? 'AM' : 'PM';
        const timeValue = parseInt(appointment_time.split(' ')[0].replace(':', ''));

        const availability = await Doctorsavailability.findOne({ where: { doctor_id, day: appointmentDay } });
        if (!availability) throw new Error('Doctor is not available on this day');

        const start = parseInt(availability.start_time.replace(':', ''));
        const end = parseInt(availability.end_time.replace(':', ''));
        const startAMPM = availability.start_time.includes('AM') ? 'AM' : 'PM';
        const endAMPM = availability.end_time.includes('AM') ? 'AM' : 'PM';

        const outsideWindow =
            (ampm === startAMPM && timeValue < start) ||
            (ampm === endAMPM && timeValue > end);

        if (outsideWindow) throw new Error('Doctor is not available at this time');

        // Check if booked
        const booked = await Appointments.findOne({ where: { doctor_id, appointment_date, appointment_time } });
        if (booked) throw new Error('Slot already booked');

        return res.response({
            success: true,
            message: 'Doctor is available for this slot'
        }).code(200);

    } catch (err) {
        console.error(err);
        return res.response({
            success: false,
            message: err.message
        }).code(200);
    }
};

const adminGetDoctorAvailableSlots = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user || session_user.role !== 'ADMIN') throw new Error('Unauthorized access');

        const { doctor_id, appointment_date } = req.payload;
        if (!doctor_id || !appointment_date)
            throw new Error('doctor_id and appointment_date are required');

        const doctor = await Doctors.findByPk(doctor_id);
        if (!doctor) throw new Error('Invalid doctor');

        const dateObj = new Date(appointment_date);
        if (dateObj < new Date()) throw new Error('Past date not allowed');

        const day = dateObj.toLocaleDateString('en-IN', { weekday: 'long' });

        const availability = await Doctorsavailability.findOne({ where: { doctor_id, day } });
        if (!availability) throw new Error('Doctor is not available on this day');

        // Convert time to date object
        const toDate = (timeStr) => {
            const [time, mod] = timeStr.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (mod === 'PM' && h !== 12) h += 12;
            if (mod === 'AM' && h === 12) h = 0;
            const d = new Date(dateObj);
            d.setHours(h, m, 0, 0);
            return d;
        };

        const start = toDate(availability.start_time);
        const end = toDate(availability.end_time);

        // Booked slots
        const booked = await Appointments.findAll({
            where: { doctor_id, appointment_date },
            raw: true
        });
        const bookedTimes = new Set(booked.map(b => b.appointment_time));

        // Generate slots
        const slots = [];
        let current = new Date(start);
        while (current < end) {
            const next = new Date(current.getTime() + 30 * 60000);
            const startStr = current.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const endStr = next.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const formattedStart = startStr.replace(' ', ' '); // remove weird spacing

            slots.push({
                start: formattedStart,
                end: endStr.replace(' ', ' '),
                is_available: !bookedTimes.has(formattedStart)
            });

            current = next;
        }

        return res.response({
            success: true,
            date: appointment_date,
            day,
            start_time: availability.start_time,
            end_time: availability.end_time,
            slots
        }).code(200);

    } catch (err) {
        console.error(err);
        return res.response({
            success: false,
            message: err.message
        }).code(200);
    }
};

const adminGetTodaysAppointments = async (req, res) => {
    try {
        const session_user = req.headers.user;
        if (!session_user || session_user.role !== 'ADMIN') throw new Error('Unauthorized access');

        const { doctor_id } = req.params;
        if (!doctor_id) throw new Error('doctor_id is required');

        const doctor = await Doctors.findByPk(doctor_id);
        if (!doctor) throw new Error('Invalid doctor');

        const today = new Date();
        const formattedToday = `${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${today
            .getDate()
            .toString()
            .padStart(2, '0')}-${today.getFullYear()}`;

        const appointments = await Appointments.findAll({
            where: { doctor_id, appointment_date: formattedToday },
            include: [
                {
                    model: Users,
                    attributes: { exclude: ['access_token', 'refresh_token', 'otp_id'] },
                    include: [{ model: Files }]
                }
            ]
        });

        return res.response({
            success: true,
            message: 'Today’s appointments fetched successfully',
            data: appointments
        }).code(200);

    } catch (err) {
        console.error(err);
        return res.response({
            success: false,
            message: err.message
        }).code(200);
    }
};

// doctor create appointment and generate payment link in razorpay
const adminCreateAppointmentWithPaymentLink = async (req, res) => {
    try {
        const session_user = req.headers.user;

        // 1️⃣ Admin authentication
        if (!session_user || session_user.role !== 'ADMIN')
            throw new Error('Unauthorized access');

        const {
            doctor_id,
            patient_id,
            appointment_date,
            appointment_time,
            reason,
            consultation_fee,
            consultation_modes
        } = req.payload;

        // 2️⃣ Validate doctor & patient
        const doctor = await Doctors.findByPk(doctor_id);
        const patient = await Users.findByPk(patient_id);
        if (!doctor || !patient) throw new Error('Invalid doctor or patient');

        // 3️⃣ Check if appointment date is valid (future date)
        const appointmentDateObj = new Date(appointment_date);
        appointmentDateObj.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (appointmentDateObj < today) throw new Error('Cannot book appointment in the past');

        // 4️⃣ Check if slot is already booked
        const existing = await Appointments.findOne({
            where: { doctor_id, appointment_date, appointment_time }
        });
        if (existing) throw new Error('Slot already booked for this time');

        // 5️⃣ Check doctor availability for that day
        const appointmentDay = appointmentDateObj.toLocaleDateString('en-IN', { weekday: 'long' });
        const availability = await Doctorsavailability.findOne({
            where: { doctor_id, day: appointmentDay }
        });
        if (!availability) throw new Error('Doctor is not available on this day');

        // 6️⃣ Check if requested time is within doctor's available time
        const [hours, minutes] = appointment_time.split(/[: ]/).map(v => parseInt(v));
        const isPM = appointment_time.includes('PM');
        let requestedTime = hours % 12 + (isPM ? 12 : 0); // 24h format

        const [startH, startM] = availability.start_time.split(/[: ]/).map(v => parseInt(v));
        const startPM = availability.start_time.includes('PM');
        const startTime = startH % 12 + (startPM ? 12 : 0) + startM / 60;

        const [endH, endM] = availability.end_time.split(/[: ]/).map(v => parseInt(v));
        const endPM = availability.end_time.includes('PM');
        const endTime = endH % 12 + (endPM ? 12 : 0) + endM / 60;

        const reqTime = requestedTime + minutes / 60;
        if (reqTime < startTime || reqTime >= endTime) throw new Error('Doctor is not available at this time');

        // 7️⃣ Create Razorpay Payment Link
        const amount = consultation_fee || doctor.consultation_fee || 500;
        const paymentLink = await razorpay.paymentLink.create({
            amount: amount * 100, // in paise
            currency: 'INR',
            accept_partial: false,
            description: `Consultation with Dr. ${doctor.name} on ${appointment_date} at ${appointment_time}`,
            customer: {
                name: patient.name,
                email: patient.email,
                contact: patient.phone
            },
            notify: { sms: true, email: true },
            reminder_enable: true,
            callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
            callback_method: 'get'
        });

        // 8️⃣ Create appointment record (pending payment)
        const appointment = await Appointments.create({
            doctor_id,
            patient_id,
            appointment_date,
            appointment_time,
            reason,
            status: 'pending',          // pending until payment
            payment_id: null,
            order_id: paymentLink.id,
            payment_signature: null,
            payment_status: 'pending',
            consultation_fee: amount,
            consultation_modes
        });

        // 9️⃣ Return appointment + payment link
        return res.response({
            success: true,
            message: 'Appointment created successfully. Share the payment link with the user.',
            data: {
                appointment,
                payment_link: paymentLink.short_url
            }
        }).code(200);

    } catch (err) {
        console.error(err);
        return res.response({
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
    getRtcToken,
    getUserAppointments,
    checkDoctorAvailability,
    getDoctorAvailableTimeSlots,
    getTodaysAppointmentsDoctor,
    UpdateAppointmentStatus,
    adminGetTodaysAppointments,
    adminCheckDoctorSlot,
    adminCreateAppointmentWithPaymentLink,
    adminGetDoctorAvailableSlots

}


// ek Api  ampount  with order id and send to frontend
// when we boojk payment will hit book appoibntnewewnt apio and payumnent id save