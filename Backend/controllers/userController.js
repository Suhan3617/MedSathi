// AlgoMed2/Backend/controllers/userController.js
const User = require('../models/user');
const DoctorProfile = require('../models/DoctorProfile');

// 🛑 1. Deactivate Account (Temporarily disable)
const deactivateAccount = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // User ko inactive mark kar do
        user.isActive = false; 
        await user.save();

        // Agar Doctor hai, toh profile ko bhi inactive / vacation mode me daal sakte ho
        if (user.role === 'doctor') {
            await DoctorProfile.findOneAndUpdate(
                { userId: req.user.id },
                { vacationMode: true } 
            );
        }

        res.status(200).json({ 
            success: true, 
            message: 'Account deactivated successfully. You can reactivate by logging in again.' 
        });
    } catch (error) {
        next(error);
    }
};

// 🛑 2. Delete Account (Permanent Delete)
const deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Agar Doctor hai, toh uski doctor profile bhi delete karni padegi
        if (user.role === 'doctor') {
            await DoctorProfile.findOneAndDelete({ userId: userId });
            // NOTE: Agar appointments bhi delete karne hain toh yahan Appointment.deleteMany(...) laga sakte ho
        }

        // Finally, User delete kar do
        await User.findByIdAndDelete(userId);

        res.status(200).json({ 
            success: true, 
            message: 'Account permanently deleted' 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    // ... existing user exports (getUserProfile, etc)
    deactivateAccount,
    deleteAccount
};