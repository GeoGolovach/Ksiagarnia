import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.get("/login", authController.showLoginForm);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/registration", authController.registrationForm);
router.post("/registration", authController.registerUser);


export default router;

// This code defines the routes for authentication in an Express application.
// It imports the necessary modules, creates a router instance, and sets up routes for showing the login form,
// handling login requests, and logging out. The routes are linked to methods in the `authController` which will handle the logic for each route.
// The `showLoginForm` method will render the login page, the `login` method will process the login form submission,