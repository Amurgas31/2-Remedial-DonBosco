import express from "express";
import registerTeacherController from "../controllers/registerTeacherController.js";

const router = express.Router();

router.route("/").post(registerTeacherController.register);
router.route("/verifyCodeEmail").post(registerTeacherController.verifyCode);

export default router;