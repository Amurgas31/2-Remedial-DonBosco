import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import teachersRoutes from "./src/routes/teachers.js";

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

app.use("/api/teachers", teachersRoutes);

export default app;
