import express from "express";
import studentsController from "../controllers/studentsController.js";

// Usamos Router() de la libreria express para definir los métodos HTTP a utilizar
const router = express.Router();

router.route("/")
    .get(studentsController.getStudents);

router.route("/:id")
    .put(studentsController.updateStudent)
    .delete(studentsController.deleteStudent);

export default router;