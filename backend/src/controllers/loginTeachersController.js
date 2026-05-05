import teachersModel from "../models/teachers.js";

import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import { config } from "../../config.js";

//Array de funciones
const loginTeachersController = {};

loginTeachersController.login = async (req, res) => {
  // 1- Solicito los datos
  const { email, password } = req.body;

  // Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: "Correo inválido" });
  }

  try {
    // 1 - Buscar el correo electrónico en la base de datos
    const teacherFound = await teachersModel.findOne({ email });

    // Si no existe el correo en la base de datos
    if (!teacherFound) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    // Verificar si el usuario está bloqueado
    if (teacherFound.timeOut && teacherFound.timeOut > Date.now()) {
      return res.status(403).json({ message: "Cuenta bloqueada" });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, teacherFound.password);

    if (!isMatch) {
      teacherFound.loginAttempts = (teacherFound.loginAttempts || 0) + 1;

      // Si llega a 5 intentos fallidos se bloquea la cuenta
      if (teacherFound.loginAttempts >= 5) {
        teacherFound.timeOut = Date.now() + 5 * 60 * 1000;
        teacherFound.loginAttempts = 0;

        await teacherFound.save();

        return res.status(403).json({
          message: "Cuenta bloqueada por multiples intentos fallidos",
        });
      }

      await teacherFound.save();

      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Resetear intentos si login correcto
    teacherFound.loginAttempts = 0;
    teacherFound.timeOut = null;

    // Generar el token
    const token = jsonwebtoken.sign(
      // 1- Que datos vamos a guardar
      { id: teacherFound._id, userType: "Teacher" },
      // 2- Secret Key
      config.JWT.secret,
      // 3- En cuanto tiempo expira
      { expiresIn: "30d" },
    );

    // El token lo guardamos en una cookie
    res.cookie("authCookie", token);

    return res.status(200).json({ message: "Login exitoso" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginTeachersController;
