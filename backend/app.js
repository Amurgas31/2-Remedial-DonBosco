import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import teachersRoutes from "./src/routes/teachers.js";
import studentsRoutes from "./src/routes/students.js";
import registerTeacherRoutes from "./src/routes/registerTeacher.js";
import registerStudentRoutes from "./src/routes/registerStudent.js";
import loginTeachersRoutes from "./src/routes/loginTeachers.js";
import loginStudentsRoutes from "./src/routes/loginStudents.js";
import logoutRoutes from "./src/routes/logout.js";
import recoveryPasswordTeacherRoutes from "./src/routes/recoveryPasswordTeacher.js";
import recoveryPasswordStudentRoutes from "./src/routes/recoveryPasswordStudent.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173/", "https://localhost:5174"],
    // permitir el envió de cookies y credenciales
    credentials: true,
  }),
);

app.use(cookieParser());

//IMPORTANTE: Que acepte los json desde postman
app.use(express.json());

app.use("/api/students", studentsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/registerTeacher", registerTeacherRoutes);
app.use("/api/registerStudent", registerStudentRoutes);
app.use("/api/loginTeacher", loginTeachersRoutes);
app.use("/api/loginStudent", loginStudentsRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/recoveryPasswordTeacher", recoveryPasswordTeacherRoutes);
app.use("/api/recoveryPasswordStudent", recoveryPasswordStudentRoutes);

export default app;
