import express from "express";
import loginTeachersController from "../controllers/loginTeachersController.js";

const router = express.Router();

router.route("/").post(loginTeachersController.login);

export default router;