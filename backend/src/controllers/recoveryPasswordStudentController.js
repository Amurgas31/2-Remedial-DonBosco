import jsonwebtoken from "jsonwebtoken"; //Generar tokens
import bcrypt from "bcryptjs"; // Enciptar contraseña
import crypto, { verify } from "crypto"; // Generar código aleatorio
import nodemailer from "nodemailer"; // Enviar correos

import HTMLRecoveryEmail from "../utils/sendMailRecovery.js";

import { config } from "../../config.js";

import studentModel from "../models/students.js";

// Array de funciones
const recoveryPasswordController = {};

recoveryPasswordController.requestCode = async (req, res) => {
  try {
    // 1- Solicitamos los datos
    const { email } = req.body;

    // 2- Validar que el correo exista en la bd
    const userFound = await studentModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ message: "user not found" });
    }

    // Generar el código aleatorio
    const randomCode = crypto.randomBytes(3).toString("hex");

    // Guardamos todo en un token
    const token = jsonwebtoken.sign(
      // 1- ¿Qué vamos a guardar?
      { email, randomCode, userType: "student", verified: false },
      // 2- Clave secreta
      config.JWT.secret,
      // 3- ¿Cúando expira?
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", token, { maxAge: 15 * 60 * 1000 });

    // Enviiar por correo electronico el código que generamos
    // 1- ¿Quién lo envía?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    // 2- mailOptons -> ¿Quien lo envía y como?
    const mailOptons = {
      from: config.email.user_email,
      to: email,
      subject: "Código de Recuperación",
      body: "El código expira en 15 minutos",
      html: HTMLRecoveryEmail(randomCode),
    };

    // 3- Enviar el correo electrónico
    transporter.sendMail(mailOptons, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending email" });
      }
    });

    return res.status(200).json({ message: "email sent" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Imternal server error" });
  }
};

recoveryPasswordController.verifyCode = async (req, res) => {
  try {
    // 1- Solicitamos los datos
    const { code } = req.body;

    //2- Obtenemos la información que está dentro del token
    //Accedemos a la cookie
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    // Ahora comparo el código que el usuario escribió con el que está dentro del token
    if (code !== decoded.randomCode) {
      return res.status(400).json({ message: "Invalid Code" });
    }

    // En cambio, si escribe bien el código vamos a colocar en el token que ya está verificado
    const newToken = jsonwebtoken.sign(
      // 1- ¿Qué vamos a guardar?
      { email: decoded.email, userType: "student", verified: true },
      // 2- Calve secreta
      config.JWT.secret,
      // 3- ¿Cuándo expira?
      { expiresIn: "15m" },
    );

    res.cookie("recoveryCookie", newToken, { maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ message: "Code verified succesfully" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

recoveryPasswordController.newPassword = async (req, res) => {
  try {
    // 1- Solicito los datos
    const { newPassword, confirmNewPassword } = req.body;

    //Comparo las dos contraseñas
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Password doesn't match" });
    }

    // Vamos comprobar la constante verified que está en el token ya esté en true (o seq que haya pasado por el paso 2)
    const token = req.cookies.recoveryCookie;
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    ////////////
    // Encriptar
    const passwordHash = await bcrypt.hash(newPassword, 10); //Cantidad de iteraciones

    // Actualizar la contraseña en la base de datos
    await studentModel.findOneAndUpdate(
      { email: decoded.email },
      { password: passwordHash },
      { new: true },
    );

    res.clearCookie("recoveryCookie");

    return res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default recoveryPasswordController;