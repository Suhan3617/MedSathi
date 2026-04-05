import axios from "axios";

const api = axios.create({
  // Hardcoded to ensure it always hits the correct backend route
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- API Functions ---

// 1. Auth Services
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerPatient = async (userData) => {
  const response = await api.post("/auth/register-patient", userData);
  return response.data;
};

export const registerDoctor = async (userData) => {
  const response = await api.post("/auth/register-doctor", userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const changePassword = async (data) => {
    return await api.post('/auth/change-password', data);
};

export const deactivateAccount = async () => {
    return await api.put('/users/deactivate');
};

export const deleteAccount = async () => {
    return await api.delete('/users/delete-account');
};

// 2. Doctor Services
export const getAllDoctors = async (query = "") => {
  const response = await api.get(`/doctors?query=${query}`);
  return response.data;
};

export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const getDoctorProfileMe = async () => {
  const response = await api.get("/doctors/profile/me");
  return response.data;
};

export const updateDoctorProfile = async (profileData) => {
  const response = await api.put("/doctors/profile", profileData);
  return response.data;
};

// 3. Appointment Services
export const bookAppointment = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

export const getMyAppointments = async () => {
  const response = await api.get("/appointments/my-appointments");
  return response.data;
};

export const updateAppointmentStatus = async (id, data) => {
  const response = await api.put(`/appointments/${id}`, data);
  return response.data;
};

export const completeConsultation = async (id, data) => {
  const response = await api.put(`/appointments/${id}/consultation`, data);
  return response.data;
};

export const submitAppointmentRating = async (id, data) => {
  const response = await api.post(`/appointments/${id}/rate`, data);
  return response.data;
};

// 4. Chat/AI Services
export const sendChatMessage = async (message, threadId = null) => {
  const response = await api.post("/chat", { message, threadId });
  return response.data;
};

export const getUserThreads = async () => {
  const response = await api.get("/chat/thread");
  return response.data;
};

export const getThreadMessages = async (threadId) => {
  const response = await api.get(`/chat/thread/${threadId}`);
  return response.data;
};

export const deleteThread = async (threadId) => {
  const response = await api.delete(`/chat/thread/${threadId}`);
  return response.data;
};

// 5. Patient Profile Services
export const getPatientProfile = async () => {
  const response = await api.get("/patients/profile/me");
  return response.data;
};

export const updatePatientProfile = async (profileData) => {
  const response = await api.put("/patients/profile", profileData);
  return response.data;
};

export const getPatientSummary = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/summary`);
  return response.data;
};

export const getPatientVitalsHistory = async (patientId) => {
  const response = await api.get(`/patients/${patientId}/vitals`);
  return response.data;
};

// 6. Clinical AI & Analytics
export const generateSOAPNotes = async (text, context) => {
  const response = await api.post("/ai/generate-soap", { text, ...context });
  return response.data;
};

export const checkSymptomsWithAI = async (messages) => {
    const response = await api.post('/ai/symptom-checker', { messages });
    return response.data;
};

export const getDoctorAnalytics = async () => {
  const response = await api.get("/analytics/doctor");
  return response.data;
};

// 7. Real-time Chat Integration
export const getFirebaseToken = async () => {
  const response = await api.get("/realtime-chat/token");
  return response.data;
};

export const uploadChatFile = async (formData) => {
  const token = localStorage.getItem("token");
  
  // 🔥 FIX: Bypassing Axios global headers completely by using native fetch.
  // This guarantees the browser creates a perfect multipart boundary.
  const response = await fetch("http://localhost:5000/api/realtime-chat/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "File upload failed");
  }
  return data;
};

export default api;