// AlgoMed2/Backend/controllers/doctorController.js
const DoctorProfile = require("../models/DoctorProfile");
const User = require("../models/user");
const Appointment = require("../models/Appointment"); 

const getAllDoctors = async (req, res, next) => {
  try {
    const { query } = req.query;

    let userQuery = { role: "doctor" };
    if (query) {
      userQuery.name = { $regex: query, $options: "i" };
    }

    const doctors = await User.find(userQuery).select("name email phone gender");

    const doctorData = await Promise.all(
      doctors.map(async (doc) => {
        const profile = await DoctorProfile.findOne({ userId: doc._id });
        if (!profile) return null; 

        return {
          _id: doc._id,
          name: doc.name,
          email: doc.email,
          specialization: profile.specialization,
          experience: profile.experience,
          fees: profile.fees,
          sessionDuration: profile.sessionDuration,
          followUpPolicy: profile.followUpPolicy,
          isApproved: profile.isApproved,
          availableSlots: profile.availableSlots,
          languages: profile.languages,
          symptomsTreated: profile.symptomsTreated,
          awards: profile.awards,
          rating: profile.rating || 0,
          reviewCount: profile.reviewCount || 0
        };
      })
    );

    const activeDoctors = doctorData.filter((d) => d !== null);

    res.status(200).json({
      success: true,
      count: activeDoctors.length,
      data: activeDoctors,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.role !== "doctor") {
      res.status(404);
      throw new Error("Doctor not found");
    }

    const profile = await DoctorProfile.findOne({ userId: req.params.id });
    if (!profile) {
      res.status(404);
      throw new Error("Doctor profile incomplete");
    }

    res.status(200).json({
      success: true,
      data: { user, profile },
    });
  } catch (error) {
    next(error);
  }
};

const getDoctorProfile = async (req, res, next) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(200).json({ success: true, data: null, message: "No profile created yet" });
    }

    // 🔥 FIX: Fetching appointmentDate and timeSlot as well
    const reviewsData = await Appointment.find({ 
        doctorId: req.user.id, 
        rating: { $exists: true, $ne: null } 
    })
    .populate('patientId', 'name') 
    .select('rating review createdAt patientId appointmentDate timeSlot')
    .sort({ createdAt: -1 }); 

    const formattedReviews = reviewsData.map(rev => ({
        _id: rev._id,
        rating: rev.rating,
        text: rev.review,
        date: rev.createdAt, // Review writing date
        appointmentDate: rev.appointmentDate, // Appointment Date
        timeSlot: rev.timeSlot, // Appointment Time
        patientName: rev.patientId ? rev.patientId.name : 'Anonymous Patient'
    }));

    const profileWithReviews = profile.toObject();
    profileWithReviews.patientReviews = formattedReviews;

    res.status(200).json({ success: true, data: profileWithReviews });
  } catch (error) {
    next(error);
  }
};

const updateDoctorProfile = async (req, res, next) => {
  try {
    const {
      specialization, experience, qualifications, fees,
      sessionDuration, followUpPolicy, about, availableSlots,
      languages, symptomsTreated, awards, socialLinks, medicalLicense
    } = req.body;

    let profile = await DoctorProfile.findOne({ userId: req.user.id });

    if (profile) {
      // Update existing
      if(specialization !== undefined) profile.specialization = specialization;
      if(experience !== undefined) profile.experience = experience;
      if(qualifications !== undefined) profile.qualifications = qualifications;
      if(fees !== undefined) profile.fees = fees;
      if(sessionDuration !== undefined) profile.sessionDuration = sessionDuration;
      if(followUpPolicy !== undefined) profile.followUpPolicy = followUpPolicy;
      if(about !== undefined) profile.about = about;
      if(availableSlots !== undefined) profile.availableSlots = availableSlots;
      
      // Update New Fields
      if(languages !== undefined) profile.languages = languages;
      if(symptomsTreated !== undefined) profile.symptomsTreated = symptomsTreated;
      if(awards !== undefined) profile.awards = awards;
      if(socialLinks !== undefined) profile.socialLinks = socialLinks;
      if(medicalLicense !== undefined) profile.medicalLicense = medicalLicense;

      const updatedProfile = await profile.save();
      return res.status(200).json({ success: true, data: updatedProfile });
    } else {
      // Create new
      profile = await DoctorProfile.create({
        userId: req.user.id,
        specialization,
        experience,
        qualifications,
        fees,
        sessionDuration,
        followUpPolicy,
        about,
        availableSlots,
        languages,
        symptomsTreated,
        awards,
        socialLinks,
        medicalLicense
      });

      return res.status(201).json({ success: true, data: profile });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorProfile,
  updateDoctorProfile,
};