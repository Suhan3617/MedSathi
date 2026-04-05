import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { getAllDoctors, bookAppointment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { SPECIALTIES } from "../components/Patient/FindDoctor/specialties";

// Components
import Header from "../components/Patient/FindDoctor/Header";
import SpecialtyFilters from "../components/Patient/FindDoctor/SpecialtyFilters";
import DoctorGrid from "../components/Patient/FindDoctor/DoctorGrid";
import BookingModal from "../components/Patient/FindDoctor/BookingModal";

const FindDoctors = () => {
  const { user } = useAuth();
  const location = useLocation();

  // State
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // Booking Modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingStatus, setBookingStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const specialtyFromUrl = queryParams.get("specialty");
    if (specialtyFromUrl && SPECIALTIES.includes(specialtyFromUrl)) {
      setSelectedSpecialty(specialtyFromUrl);
    }
    fetchDoctors();
  }, [location.search]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await getAllDoctors();
      setDoctors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load doctors", err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = useMemo(() => {
    const filtered = doctors.filter((doc) => {
      if (!doc) return false;
      const docName = (doc.name || "").toLowerCase();
      const spec = (doc.specialization || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        docName.includes(query) ||
        spec.includes(query) ||
        (doc.symptomsTreated || []).some((sym) =>
          sym.toLowerCase().includes(query),
        );
      const matchesSpecialty =
        selectedSpecialty === "All" ||
        (doc.specialization || "") === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
    return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }, [doctors, searchQuery, selectedSpecialty]);

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingData({ date: "", timeSlot: "", reason: "" });
    setAvailableSlots([]);
    setBookingStatus({ loading: false, message: "", error: false });
  };

  const handleDateChange = (e) => {
    const dateStr = e.target.value;
    setBookingData((prev) => ({ ...prev, date: dateStr, timeSlot: "" }));
    if (!dateStr || !selectedDoctor) return;
    const dateObj = new Date(dateStr);
    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });
    const daySchedule = (selectedDoctor.availableSlots || []).find(
      (s) => s.day === dayName,
    );
    if (daySchedule) {
      setAvailableSlots(
        generateTimeSlots(
          daySchedule.startTime,
          daySchedule.endTime,
          selectedDoctor.sessionDuration || 15,
          dateObj,
        ),
      );
    } else {
      setAvailableSlots([]);
    }
  };

  const generateTimeSlots = (start, end, durationMins, selectedDateObj) => {
    if (!start || !end) return [];
    const slots = [];
    let currentSlotTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const now = new Date();
    const isToday = selectedDateObj.toDateString() === now.toDateString();
    let cutoffTimeStr = isToday
      ? now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      : "00:00";

    while (currentSlotTime < endTime) {
      const slotTimeStr24 = currentSlotTime.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      if (!isToday || slotTimeStr24 > cutoffTimeStr) {
        slots.push(
          currentSlotTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      }
      currentSlotTime.setMinutes(currentSlotTime.getMinutes() + durationMins);
    }
    return slots;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.timeSlot) {
      setBookingStatus({
        loading: false,
        message: "Please select a time slot",
        error: true,
      });
      return;
    }
    setBookingStatus({ loading: true, message: "", error: false });
    try {
      await bookAppointment({
        doctorId: selectedDoctor._id,
        appointmentDate: bookingData.date,
        timeSlot: bookingData.timeSlot,
        type: "Online",
        reason: bookingData.reason,
      });
      setBookingStatus({
        loading: false,
        message: "Booking Successful!",
        error: false,
      });
      setTimeout(() => setSelectedDoctor(null), 1500);
    } catch (err) {
      setBookingStatus({
        loading: false,
        message: err.response?.data?.message || "Booking failed.",
        error: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0A0F1E] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <SpecialtyFilters 
          selectedSpecialty={selectedSpecialty} 
          setSelectedSpecialty={setSelectedSpecialty} 
        />

        <DoctorGrid 
          loading={loading} 
          filteredDoctors={filteredDoctors} 
          handleBookClick={handleBookClick} 
        />

        <BookingModal
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
          bookingData={bookingData}
          setBookingData={setBookingData}
          handleDateChange={handleDateChange}
          availableSlots={availableSlots}
          handleBookingSubmit={handleBookingSubmit}
          bookingStatus={bookingStatus}
        />

      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Custom text rendering for medical grade UI */
        h1, h2, h3, button {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </div>
  );
};

export default FindDoctors;