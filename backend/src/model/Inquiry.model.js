import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    message: { 
        type: String 
    },
    goal: { 
        type: String
    }, 
    status: { 
        type: String, 
        enum: ['New', 'Contacted', 'Joined', 'Lost'], 
        default: 'New' 
    }
}, { timestamps: true });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);