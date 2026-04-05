const Appointment = require('../models/Appointment');
const User = require('../models/user');
const PatientProfile = require('../models/PatientProfile'); 

const bookAppointment = async (req, res, next) => {
    try {
        const { doctorId, appointmentDate, timeSlot, type, reason } = req.body;

        // 1. Check if doctor exists and is actually a doctor
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            res.status(404);
            throw new Error('Doctor not found');
        }

        // 2. Check for double booking (Same Doctor, Same Date, Same Slot)
        const existingAppointment = await Appointment.findOne({
            doctorId,
            appointmentDate,
            timeSlot,
            status: { $nin: ['Cancelled'] } // Ignore cancelled slots
        });

        if (existingAppointment) {
            res.status(400);
            throw new Error('This time slot is already booked. Please choose another.');
        }

        // 3. Create Appointment
        const appointment = await Appointment.create({
            patientId: req.user.id, // From authMiddleware
            doctorId,
            appointmentDate,
            timeSlot,
            type,
            reason
        });

        res.status(201).json({
            success: true,
            data: appointment,
            message: "Appointment booked successfully"
        });

    } catch (error) {
        next(error);
    }
};

const getMyAppointments = async (req, res, next) => {
    try {
        let query = {};

        // If Patient -> show their bookings
        if (req.user.role === 'patient') {
            query = { patientId: req.user.id };
        } 
        // If Doctor -> show bookings assigned to them
        else if (req.user.role === 'doctor') {
            query = { doctorId: req.user.id };
        } 
        // If Admin -> show all
        else if (req.user.role === 'admin') {
            query = {}; 
        }

        // Fetch appointments and populate names
        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone gender')
            .populate('doctorId', 'name email') 
            .sort({ appointmentDate: 1, timeSlot: 1 }); // Sort ascending

        // ENRICH DATA (Checking Risk Factors for Doctors)
        const enrichedAppointments = await Promise.all(appointments.map(async (appt) => {
            const apptObj = appt.toObject();
            
            // Only process risk factors if user is a doctor and patient data exists
            if (req.user.role === 'doctor' && appt.patientId && appt.patientId._id) {
                const profile = await PatientProfile.findOne({ userId: appt.patientId._id })
                                                  .select('medicalHistory allergies');
                
                let isHighRisk = false;
                let riskFactors = [];

                if (profile) {
                    const activeConditions = profile.medicalHistory?.filter(c => c.status === 'Active') || [];
                    if (activeConditions.length > 0) {
                        isHighRisk = true;
                        riskFactors.push(...activeConditions.map(c => c.condition));
                    }
                    
                    const severeAllergies = profile.allergies?.filter(a => a.severity === 'Severe') || [];
                    if (severeAllergies.length > 0) {
                        isHighRisk = true;
                        riskFactors.push("Severe Allergies");
                    }
                }
                
                apptObj.riskTag = isHighRisk ? 'High Risk' : 'Routine';
                apptObj.riskFactors = riskFactors;
            } else {
                apptObj.riskTag = 'Routine';
                apptObj.riskFactors = [];
            }

            return apptObj;
        }));

        res.status(200).json({
            success: true,
            count: enrichedAppointments.length,
            data: enrichedAppointments
        });

    } catch (error) {
        next(error);
    }
};

const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status, doctorNotes, videoLink } = req.body;
        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        if (req.user.role !== 'admin' && appointment.doctorId.toString() !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to update this appointment');
        }

        if (status) appointment.status = status;
        if (doctorNotes) appointment.doctorNotes = doctorNotes;
        if (videoLink) appointment.videoLink = videoLink;

        const updatedAppointment = await appointment.save();

        res.status(200).json({
            success: true,
            data: updatedAppointment,
            message: `Appointment updated to ${status || 'new status'}`
        });

    } catch (error) {
        next(error);
    }
};

// 🔥 THIS IS WHERE THE PRESCRIPTION AND AI NOTES ARE SAVED
const completeConsultation = async (req, res, next) => {
    try {
        const appointmentId = req.params.id;
        const { 
            doctorNotes, 
            diagnosis, 
            prescription, 
            vitals,
            outcome 
        } = req.body;

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            res.status(404);
            throw new Error('Appointment not found');
        }

        // Only assigned doctor can complete it
        if (appointment.doctorId.toString() !== req.user.id) {
            res.status(403);
            throw new Error('Not authorized to manage this appointment');
        }

        // Using standard update approach to ensure all text fields are captured
        appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
        appointment.diagnosis = diagnosis || appointment.diagnosis;
        appointment.prescription = prescription || appointment.prescription;
        appointment.outcome = outcome || appointment.outcome;
        
        if (vitals) {
            appointment.vitals = { ...appointment.vitals, ...vitals };
        }

        appointment.status = 'Completed';
        
        const updatedAppointment = await appointment.save();

        res.status(200).json({
            success: true,
            data: updatedAppointment,
            message: "Consultation completed successfully"
        });

    } catch (error) {
        next(error);
    }
};

const rateAppointment = async (req, res, next) => {
    try {
        const { rating, review } = req.body;
        const appointmentId = req.params.id;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        // Update appointment
        appointment.rating = rating;
        appointment.review = review;
        await appointment.save();

        // Calculate doctor's new average rating
        const DoctorProfile = require("../models/DoctorProfile"); // Make sure to import this
        const allRatings = await Appointment.find({ doctorId: appointment.doctorId, rating: { $exists: true, $ne: null } });
        
        const totalReviews = allRatings.length;
        const avgRating = allRatings.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews;

        await DoctorProfile.findOneAndUpdate(
            { userId: appointment.doctorId },
            { rating: avgRating.toFixed(1), reviewCount: totalReviews }
        );

        res.status(200).json({ success: true, message: "Rating submitted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    completeConsultation,
    rateAppointment
};