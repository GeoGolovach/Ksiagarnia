import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.get("/login", authController.showLoginForm);
router.post("/login", authController.loginUser);
router.get("/registration", authController.registrationForm);
router.post("/registration", authController.registerUser);
router.post("/logout", authController.logoutUser);


export default router;
