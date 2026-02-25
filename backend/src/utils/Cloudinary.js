import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // File system module to manage local files

// Cloudinary Configuration (Inhe apni .env file mein zaroor add karein)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

/**
 * Upload a file to Cloudinary
 * @param {string} localFilePath - Path of the file saved by Multer
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // File ko cloudinary par upload karein
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto", // Automatically detect if it's an image or video
            folder: "taitantranning/avatars" // Organized folder structure
        });

        // File successfully upload ho gayi hai
        // Local temporary file ko delete karein
        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        // Agar upload fail ho jaye, toh local temporary file ko remove karein 
        // taaki server par kachra jama na ho
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

/**
 * Delete a file from Cloudinary using its Public ID
 * @param {string} publicId - The public_id of the image on Cloudinary
 */
const deleteOnCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return null;
    }
};

export { uploadOnCloudinary, deleteOnCloudinary };