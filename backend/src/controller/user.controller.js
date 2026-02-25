import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/Cloudinary.js"; 

// Helper function to generate tokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Token generation failed");
    }
};

// 1. REGISTER USER
export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, phoneNumber, fitnessGoal, weight, height } = req.body;

    // Validation
    if ([fullName, email, password ].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Required fields are missing");
    }

    const existedUser = await User.findOne({ $or: [{ email }] });
    if (existedUser) throw new ApiError(409, "User already exists");

    // Avatar handling (Cloudinary)
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) throw new ApiError(400, "Avatar upload failed");

    // Create User
    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        password,
        phoneNumber,
        avatar: avatar.secure_url,
        fitnessGoal,
        weight,
        height
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// 2. LOGIN USER
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!(password || email)) throw new ApiError(400, "Email or password required");

    const user = await User.findOne({ $or: [{ email },] }).select("+password"); // Select password specifically

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "Login successful"));
});

// 3. LOGOUT USER
export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

    const options = { httpOnly: true, secure: true };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// 4. UPDATE USER PROFILE (Weight, Height, Fitness Goal)
export const updateFitnessProfile = asyncHandler(async (req, res) => {
    const { weight, height, fitnessGoal } = req.body;

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { weight, height, fitnessGoal } },
        { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, user, "Fitness profile updated"));
});