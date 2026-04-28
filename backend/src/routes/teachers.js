import express from "express";
import customerController from "../controllers/teachersController.js";

// Usamos Router() de la libreria express para definir los métodos HTTP a utilizar
const router = express.Router();

router.route("/")
    .get(customerController.getTeachers);

router.route("/:id")
    .put(customerController.updateTeacher)
    .delete(customerController.deleteTeacher);

export default router;