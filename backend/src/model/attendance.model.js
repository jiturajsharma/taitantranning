import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: Date, 
        default: Date.now },
        checkInTime: {
                type: String, 
                required: true 
                }, // e.g., "07:30 AM"
        status: { 
            type: String, 
            default: 'Present' 
        }
});

attendanceSchema.index({ user: 1, date: -1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);