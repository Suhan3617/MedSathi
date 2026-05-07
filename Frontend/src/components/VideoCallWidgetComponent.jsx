import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiPhoneOff,
  FiMaximize2,
  FiMinimize2,
  FiLoader,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const VideoCallWidget = ({ appointment, onClose }) => {
  const { user } = useAuth();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("Initializing...");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [callEnded, setCallEnded] = useState(false); // 🔥 FIX: Track if call is properly ended

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const localStreamRef = useRef(null);
  const pendingCandidates = useRef([]);

  // Cleanup & instantly notify the other peer
  const leaveCall = () => {
    // Notify the other person before tearing down
    if (socket.current) {
      socket.current.emit("end-call", { roomId: appointment._id });
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    if (socket.current) {
      socket.current.disconnect();
    }
  };

  const handleUserEndCall = () => {
    leaveCall();
    if (onClose) onClose();
  };

  // Centralized function to handle when someone leaves or connection drops
  const handleRemoteDisconnect = () => {
    setCallStatus("Call Ended");
    setCallEnded(true);
    setRemoteStream(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    let isMounted = true; 

    const initCall = async () => {
      try {
        let stream = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        } catch (err) {
          console.warn("Camera blocked. Trying Audio only...");
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: true,
            });
            if (isMounted) setIsCameraOn(false);
          } catch (audioErr) {
            alert("No media devices accessible.");
            return;
          }
        }

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        setLocalStream(stream);
        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const backendUrl = import.meta.env.VITE_API_BASE_URL
          ? import.meta.env.VITE_API_BASE_URL.replace("/api", "")
          : "http://localhost:5000";

        socket.current = io(backendUrl, {
          auth: { token: localStorage.getItem("token") },
        });

        socket.current.on("connect", () => {
          socket.current.emit("join-room", { appointmentId: appointment._id });
          setCallStatus("Waiting for other party...");
        });

        socket.current.on("user-connected", () => {
          setCallStatus("Connecting...");
          setCallEnded(false);
          createOffer();
        });

        // 🔥 FIX: Listen for instant disconnect from the other peer
        socket.current.on("user-left", () => {
          handleRemoteDisconnect();
        });

        socket.current.on("offer", async ({ offer }) => {
          setCallStatus("Connecting...");
          setCallEnded(false);
          const pc = createPeerConnection();
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          
          while (pendingCandidates.current.length > 0) {
            await pc.addIceCandidate(pendingCandidates.current.shift());
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.current.emit("answer", { roomId: appointment._id, answer });
        });

        socket.current.on("answer", async ({ answer }) => {
          const pc = peerConnection.current;
          if (pc && pc.signalingState !== "stable") {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            while (pendingCandidates.current.length > 0) {
              await pc.addIceCandidate(pendingCandidates.current.shift());
            }
          }
        });

        socket.current.on("ice-candidate", async ({ candidate }) => {
          const pc = peerConnection.current;
          const rtcCandidate = new RTCIceCandidate(candidate);
          
          if (pc && pc.remoteDescription) {
            await pc.addIceCandidate(rtcCandidate).catch(e => console.error(e));
          } else {
            pendingCandidates.current.push(rtcCandidate);
          }
        });

      } catch (error) {
        console.error("Init Error:", error);
        if (isMounted) onClose();
      }
    };

    initCall();

    return () => {
      isMounted = false;
      leaveCall();
    };
  }, [appointment._id]);

  // --- 2. WEBRTC FUNCTIONS ---
  const createPeerConnection = () => {
    if (peerConnection.current) return peerConnection.current;
    
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnection.current = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", {
          roomId: appointment._id,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      setCallStatus("Connected");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // 🔥 FIX: Clear frozen frames if network drops or peer closes connection
    pc.onconnectionstatechange = () => {
      if (["disconnected", "failed", "closed"].includes(pc.connectionState)) {
        handleRemoteDisconnect();
      }
    };

    pc.oniceconnectionstatechange = () => {
      if (["disconnected", "failed", "closed"].includes(pc.iceConnectionState)) {
        handleRemoteDisconnect();
      }
    };

    return pc;
  };

  const createOffer = async () => {
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.current.emit("offer", { roomId: appointment._id, offer });
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getAudioTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsMicOn(track.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current) {
      const track = localStreamRef.current.getVideoTracks()[0];
      if (track) {
        track.enabled = !track.enabled;
        setIsCameraOn(track.enabled);
      }
    }
  };

  // --- 3. RENDER ---
  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-[9999] bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white px-5 py-3 rounded-full flex items-center gap-3 cursor-pointer shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:bg-slate-800 transition-colors group"
          onClick={() => setIsMinimized(false)}
        >
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-bold tracking-wide">Call Active</span>
          <FiMaximize2 className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity" size={16} />
        </motion.div>
      ) : (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full h-[100dvh] md:h-[85vh] md:max-w-5xl bg-slate-900 md:rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 left-0 right-0 z-20 px-4 md:px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 border border-red-500/50 text-red-500 text-[10px] font-extrabold px-2.5 py-1 rounded-md tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> LIVE
                </div>
                <div className="flex flex-col">
                  <h4 className="m-0 text-white font-bold text-sm md:text-base drop-shadow-md">
                    {appointment.patientId?.name || "Patient Consultation"}
                  </h4>
                  <span className="text-xs font-medium text-slate-300 drop-shadow-md">
                    {callStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-colors focus:outline-none"
              >
                <FiMinimize2 size={18} />
              </button>
            </div>

            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 w-full h-full">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className={`w-full h-full object-cover md:object-contain bg-slate-950 transition-opacity duration-500 ${remoteStream && !callEnded ? "opacity-100" : "opacity-0"}`}
                />
                
                {/* 🔥 FIX: Dynamic Fallback UI based on Call Status */}
                {(!remoteStream || callEnded) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-900">
                    {callEnded ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
                          <FiPhoneOff size={32} className="text-red-500" />
                        </div>
                        <p className="text-sm font-bold tracking-wide text-red-400">
                          The other person has left the call.
                        </p>
                      </>
                    ) : (
                      <>
                        <FiLoader className="animate-spin text-cyan-500" size={32} />
                        <p className="text-sm font-medium tracking-wide">
                          {callStatus === "Waiting for other party..." 
                            ? "Waiting for them to join..." 
                            : "Establishing secure connection..."}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className={`absolute bottom-24 right-4 md:bottom-6 md:right-6 w-28 h-40 md:w-48 md:h-32 bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 z-10 transition-all duration-300 transform scale-x-[-1]`}>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${!isCameraOn ? "opacity-0" : "opacity-100"}`}
                />
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500 transform scale-x-[-1]">
                    <FiVideoOff size={24} />
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-6 md:py-8 flex justify-center items-center gap-4 md:gap-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMic}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none backdrop-blur-md border ${isMicOn ? "bg-slate-800/80 text-white border-white/10 hover:bg-slate-700/80" : "bg-red-500/90 text-white border-red-500 hover:bg-red-600/90"}`}
              >
                {isMicOn ? <FiMic size={20} /> : <FiMicOff size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUserEndCall}
                className="w-16 h-12 md:w-20 md:h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-colors focus:outline-none border border-red-500"
              >
                <FiPhoneOff size={22} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleCamera}
                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-colors focus:outline-none backdrop-blur-md border ${isCameraOn ? "bg-slate-800/80 text-white border-white/10 hover:bg-slate-700/80" : "bg-red-500/90 text-white border-red-500 hover:bg-red-600/90"}`}
              >
                {isCameraOn ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VideoCallWidget;