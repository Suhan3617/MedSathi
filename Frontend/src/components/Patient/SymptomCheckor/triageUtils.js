export const getTriageColor = (level) => {
  if (!level) return "#06B6D4"; // Updated to Cyan accent
  if (
    level.toLowerCase().includes("high") ||
    level.toLowerCase().includes("emergency")
  )
    return "#ef4444";
  if (level.toLowerCase().includes("medium")) return "#f59e0b";
  return "#10b981"; // Softened green for medical UI
};