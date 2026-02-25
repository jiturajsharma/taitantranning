import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    type: { type: String, 
        enum: ['Workout', 'Diet'], 
        required: true },
        content: [{ 
        day: String, 
        details: String // e.g., "Day 1: Chest & Triceps"
    }],
    pdfUrl: { 
    type: String 
}, // Optional diet chart link
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Admin or Trainer
}, { timestamps: true });

export const Plan = mongoose.model('Plan', planSchema)