import { Router } from "express";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateFitnessProfile 
} from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();



router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]), 
    registerUser
);

// Login: Email aur Password verify karege
router.route("/login").post(loginUser);



router.route("/logout").post(verifyJWT, logoutUser);
router.route("/update-fitness").patch(verifyJWT, updateFitnessProfile);



export default router;