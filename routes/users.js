import { Router } from "express";
import userController from "../controllers/userController.js";
import { ensureAuthenticated } from "../middlewares/auth.js";
import { upload } from '../config/multer.js';

const router = Router();

router.use(ensureAuthenticated)
router.get("/profile", userController.showProfile);
router.post("/update-profile", userController.updateProfile);
router.post("/add-to-wishlist", ensureAuthenticated, userController.addToWishlist);
// router.post("/upload-avatar", upload.single('avatar'), userController.uploadAvatar);
router.post("/profile/orders", userController.getUserOrders);
router.post("/profile/wishlist/remove-from-wishlist", userController.deleteFromWishlist);
router.post("/profile/orders/remove-from-orders", userController.deleteFromOrders);
router.post("/profile/wishlist", userController.getUserWishlist);


export default router;
