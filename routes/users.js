import { Router } from "express";
import userController from "../controllers/userController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";
import { upload } from '../config/multer.js';

const router = Router();

router.use(ensureAuthenticated)
router.get("/profile", userController.showProfile);
router.post("/update-profile", userController.updateProfile);
router.post("/logout", userController.logout);
router.post("/upload-avatar", upload.single('avatar'), userController.uploadAvatar);
router.post("/profile/orders", userController.getOrders);
router.post("/profile/orders/remove-from-orders", userController.removeFromOrders);
router.post("/profile/add-to-wishlist", userController.addToWishlist);
router.post("/profile/wishlist", userController.getWishlist);
router.post("/profile/wishlist/remove-from-wishlist", userController.removeFromWishlist);


export default router;
