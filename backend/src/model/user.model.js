import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({

    fullName: {
            type: String,
            required: [true, 'Name is required'],
            lowercase: true,
            trim: true,
            index: true
    },

    email: { 
        type: String, 
        required: [true, 'email is required'], 
        unique: true,
        lowercase: true,
        trim: true
    },

    password: { 
        type: String, 
        required: [true, 'password is required'],
        select: false
    },

    phoneNumber: { 
        type: Number, 
        required: [true, 'phone number is required'] 
    },
        role: { 
            type: String, 
            enum: ['user', 'admin', 'trainer'], 
            default: 'user'
        },

  // Fitness Profile
    age: { 
        type: Number 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'] 
    },
    weight: { 
        type: Number 
    }, // in kg
    height: { 
        type: Number 
    }, // in cm

    fitnessGoal: {
        type: String, 
        enum: ['Weight Loss', 'Muscle Gain', 'Flexibility', 'General Fitness'] 
    },

    avatar: { 
        type: String, 
        default: 'default-avatar.png' 
    },
    
    isVerified: { 
        type: Boolean, default: false 
    }
    
}, { timestamps: true });



userSchema.pre('save', async function () { // 'next' ko yahan se hata dein
    if (!this.isModified('password')) return;

    try {
        this.password = await bcrypt.hash(this.password, 10);
        // next() ki zarurat nahi hai async function mein
    } catch (error) {
        throw error; // Direct error throw karein, Mongoose ise handle kar lega
    }
});

// Schema instance methods
userSchema.methods = {

    comparePassword: async function (plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
    },

    generateAccessToken: function () {
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
    },


    generateRefreshToken: function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );
    },
};

export const User = mongoose.model('User', userSchema);