import React from "react";
import { BsStars } from "react-icons/bs";
import {
  FiShield,
  FiCreditCard,
  FiInfo,
  FiBriefcase,
  FiMail,
  FiLock,
  FiFileText,
  FiFilePlus,
} from "react-icons/fi";

export const FOOTER_DATA = {
  features: {
    title: "MedSathi Features",
    icon: <BsStars className="text-yellow-500" />,
    content:
      "MedSathi offers a comprehensive, next-generation suite of tools designed to revolutionize healthcare:\n\n🤖 Advanced AI Symptom Checker: Our flagship feature! Patients interact with an intelligent triage assistant that asks dynamic, context-aware follow-up questions. It assesses symptom severity in real-time, generates a clinical summary, and automatically recommends the right specialist (e.g., Cardiologist, Dermatologist) before the appointment even begins.\n\n⚡ Automated SOAP Notes: Doctors save hours of manual charting. Our AI listens to the consultation and instantly generates highly accurate Subjective, Objective, Assessment, and Plan notes, along with ICD-10 suggestions.\n\n📹 Telemedicine Suite: High-definition, low-latency WebRTC video consultations integrated directly with the patient's medical records.\n\n📊 Smart Health Profiles: Dynamic BMI tracking, daily vital sign logging (BP, SpO2, Heart Rate), and visual wellness journeys.",
  },
  security: {
    title: "Security Architecture",
    icon: <FiShield className="text-emerald-500" />,
    content:
      "In healthcare, data security is non-negotiable. MedSathi is built on a Zero-Trust Security Architecture.\n\n🔒 End-to-End Encryption: All live video consultations use secure WebRTC protocols with strict E2EE. Your doctor-patient conversations cannot be intercepted.\n\n🗄️ Data at Rest & Transit: Medical records, vitals, and AI chat histories are encrypted using AES-256 at rest and TLS 1.3 during transit across our servers.\n\n🛡️ Infrastructure: We utilize strict IAM (Identity and Access Management) roles, multi-factor authentication (MFA) for administrative access, and conduct routine third-party penetration testing to ensure our cloud infrastructure is bulletproof against emerging cyber threats.",
  },
  pricing: {
    title: "Pricing Plans",
    icon: <FiCreditCard className="text-indigo-500" />,
    content:
      "MedSathi is currently in its highly anticipated Beta phase, focused on democratizing access to intelligent healthcare.\n\n👤 For Patients: 100% FREE. Access the AI Symptom Checker, track your daily vitals, and book secure video appointments without any hidden platform fees.\n\n🩺 For Doctors & Clinics: Enjoy completely FREE access to our premium Telemedicine suite, AI SOAP note generation, and patient management dashboard during the Beta period.\n\n🏢 Enterprise Tier: Launching soon for large hospital networks, featuring custom AI model fine-tuning, dedicated server instances, and full EHR/EMR integrations.",
  },
  about: {
    title: "About Us",
    icon: <FiInfo className="text-blue-500" />,
    content:
      "Founded with a vision to bridge the massive gap between cutting-edge Artificial Intelligence and everyday clinical practice, MedSathi is a premier AI-integrated telemedicine portal.\n\nWe act as an 'AI Second Brain' for doctors, drastically reducing administrative burnout so they can focus on what matters most: patient care. For patients, we serve as a 24/7 intelligent guide. Instead of endlessly searching Google for symptoms, our conversational AI Symptom Checker understands their distress and instantly connects them to the right medical professional.\n\nDriven by innovation, compassion, and state-of-the-art technology, we believe healthcare should be accessible, lightning-fast, and deeply human-centric.",
  },
  careers: {
    title: "Careers at MedSathi",
    icon: <FiBriefcase className="text-orange-500" />,
    content:
      "We are on a relentless mission to build the future of healthcare, and we need the brightest minds to get there. We are a fast-moving, remote-first team of innovators.\n\n🚀 Why Join Us?\nWork on complex, life-saving challenges. Build advanced AI models that process real-time medical data, create seamless video streaming architectures, and design intuitive interfaces that millions will rely on.\n\n🔥 Current Openings:\n• Senior MERN Stack Engineer: Help scale our real-time Node/Express backend.\n• AI/ML NLP Specialist: Enhance our AI Symptom Checker's contextual understanding.\n• UI/UX Designer: Craft pixel-perfect, accessible medical dashboards.\n\nSend your resume and GitHub profile to: careers@medsathi.com",
  },
  contact: {
    title: "Contact Support",
    icon: <FiMail className="text-cyan-500" />,
    content:
      "We are here for you 24/7. Whether you are a doctor needing technical assistance or a patient with a booking query, our support team is always ready.\n\n📧 General Queries: info@medsathi.com\n🛠️ Technical Support: support@medsathi.com\n📞 Helpline: +91 800-MED-SATHI\n🏢 HQ: IIT (ISM) Dhanbad, Jharkhand, India.\n\n⏱️ Expected Response Time:\n• Critical Consultation Issues: < 5 minutes (via in-app Live Chat)\n• General Support & Billing: < 2 hours.",
  },
  privacy: {
    title: "Privacy Policy",
    icon: <FiLock className="text-pink-500" />,
    content:
      "Your medical data belongs to YOU. MedSathi's privacy policy is built on absolute transparency.\n\n🚫 No Data Selling: We NEVER sell, rent, or share your personal information, consultation history, or vitals with third-party advertisers.\n\n🤖 AI Processing: Data processed by our AI Symptom Checker or SOAP Note generator is highly transient. We do NOT use your private medical data to train public Large Language Models (LLMs) without explicit, opt-in consent.\n\n🗑️ Right to be Forgotten: You maintain full control. You can permanently delete your account, vitals, and entire appointment history with a single click from your account settings.",
  },
  terms: {
    title: "Terms of Service",
    icon: <FiFileText className="text-purple-500" />,
    content:
      "By using MedSathi, you agree to our operational guidelines:\n\n⚠️ NOT FOR EMERGENCIES: The AI Symptom Checker is an 'assistive' triage tool. It is NOT a substitute for professional medical diagnosis or emergency services. If you are experiencing a life-threatening medical emergency, call your local emergency number immediately.\n\n🩺 Medical Liability: MedSathi provides the technology platform. Final clinical decisions, diagnoses, and prescriptions are the sole responsibility of the registered medical practitioner.\n\n⚖️ Fair Use: Attempting to reverse-engineer our AI models, scraping provider data, or submitting fraudulent medical claims will result in an immediate account ban and potential legal action.",
  },
  hipaa: {
    title: "HIPAA Compliance",
    icon: <FiFilePlus className="text-teal-500" />,
    content:
      "MedSathi is engineered from the ground up to strictly comply with the Health Insurance Portability and Accountability Act (HIPAA) standards.\n\n🔒 ePHI Protection: All electronic Protected Health Information (ePHI) is heavily guarded. We maintain rigorous, immutable audit logs tracking exactly who accessed which patient record and at what time.\n\n🤝 Business Associate Agreements (BAAs): We readily sign BAAs with covered entities (hospitals, private clinics) to legally guarantee our commitment to safeguarding sensitive patient data.\n\n⚙️ Access Controls: Automatic session timeouts, forced password rotations, and strict role-based access controls ensure that patient data is only visible to authorized medical personnel.",
  },
};
