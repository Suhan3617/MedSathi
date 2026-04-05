const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // General Medical Info
    dateOfBirth: {
      type: Date,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    vitals: {
        bloodPressure: { type: String, default: "" },
        heartRate: { type: String, default: "" },
        temperature: { type: String, default: "" },
        spO2: { type: String, default: "" },
        lastUpdated: { type: Date }
    },
    // Medical History
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ["Active", "Cured", "Managed"],
        },
      },
    ],
    allergies: [
      {
        allergen: String,
        reaction: String,
        severity: {
          type: String,
          enum: ["Mild", "Moderate", "Severe"],
        },
      },
    ],
    currentMedications: [
      {
        name: String,
        dosage: String,
        frequency: String,
      },
    ],
    // Lifestyle for AI analysis
    lifestyle: {
      smoking: {
        type: String,
        enum: ["Yes", "No", "Occasionally"],
        default: "No",
      },
      alcohol: {
        type: String,
        enum: ["Yes", "No", "Occasionally"],
        default: "No",
      },
      activityLevel: {
        type: String,
        enum: ["Sedentary", "Moderate", "Active"],
        default: "Moderate",
      },
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    familyHistory: [
      {
        relation: String,
        condition: String,
      },
    ],
    pastSurgeries: [
      {
        name: String,
        year: String,
      },
    ],
    vaccinations: [
      {
        name: String,
        date: String, 
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.PatientProfile ||
  mongoose.model("PatientProfile", patientProfileSchema);
