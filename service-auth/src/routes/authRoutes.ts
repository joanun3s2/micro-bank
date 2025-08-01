import { Router } from "express";
import { AuthController } from "../controllers/authController";

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/validate", authController.validateToken.bind(authController));

export default router;
