import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    planName: { 
        type: String, 
        required: true 
    }, // e.g., 'Gold Yearly'
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Expired', 'Pending'], 
        default: 'Pending' },
    startDate: { 
        type: Date, 
        default: Date.now 
    },
    expiryDate: { 
        type: Date, 
        required: true 
    },
    paymentId: { 
        type: String 
    }, // Razorpay/Stripe ID
}, { timestamps: true });

export const Subscription =  mongoose.model('Subscription', subscriptionSchema);