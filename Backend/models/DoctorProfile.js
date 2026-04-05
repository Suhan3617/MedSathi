// AlgoMed2/Backend/models/DoctorProfile.js
const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, "Please add a specialization"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "Please add years of experience"],
      default: 0,
    },
    qualifications: {
      type: [String],
      required: [true, "Please add qualifications"],
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    symptomsTreated: {
      type: [String],
      default: [],
    },
    awards: {
      type: [String],
      default: [],
    },
    socialLinks: {
      website: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    medicalLicense: {
      registrationNumber: { type: String, default: "" },
      medicalCouncil: { type: String, default: "" },
    },
    fees: {
      type: Number,
      required: [true, "Please add consultation fee"],
      default: 0,
    },
    sessionDuration: {
      type: Number,
      default: 15,
    },
    followUpPolicy: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      default: "",
    },
    verificationDocument: {
      type: String,
      default: "",
    },
    availableSlots: [
      {
        day: {
          type: String,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    vacationMode: { type: Boolean, default: false },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.DoctorProfile ||
  mongoose.model("DoctorProfile", doctorProfileSchema);
