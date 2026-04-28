import nodemailer from "nodemailer"; // Enviar correo
import crypto from "crypto"; // Generar codigo aleatorio
import jsonwebtoken from "jsonwebtoken"; // Token
import bcryptjs from "bcryptjs"; // Encriptar

import customerModel from "../models/customers.js";

import { config } from "../../config.js";

// Array de funciones
const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
  // 1 - Solicitar los Datos
  const { name, lastName, birthdate, email, password, isVerified } = req.body;

  try {
    // Validar que el correo no exista en la base de datos
    const existsCustomer = await customerModel.findOne({ email });
    if (existsCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Encriptar la contraseña
    const passwordHashed = await bcryptjs.hash(password, 10); // El número 10 es por la cantidad de veces que se encripta ("salt numbers")

    // Generar un código aleatorio
    const randomNumber = crypto.randomBytes(3).toString("hex"); // hexadecimal

    // Guardamos en un token la información
    const token = jsonwebtoken.sign(
      // 1- ¿Qué vamos a guardar?
      {
        randomNumber,
        name,
        lastName,
        birthdate,
        email,
        password: passwordHashed,
        isVerified,
      },
      // 2- Secret Key
      config.JWT.secret,
      // 3- Cuando expira
      { expiresIn: "15m" },
    );

    res.cookie("registrationCookie", token, { maxAge: 15 * 60 * 1000 });

    // ENVIAMOS EL CÓDIGO ALEATORIO POR CORREO ELECTRÓNICO
    // 1- Transporter -> ¿Quién envía el correo?
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email.user_email,
        pass: config.email.user_password,
      },
    });

    // 2- mailOption -> ¿Quién lo recibe y cómo?
    const mailOptions = {
      from: config.email.user_email,
      to: email,
      subject: "Verificación de Cuenta",
      text:
        "Para verificar tu cuenta, utiliza este código " +
        randomNumber +
        " expira en 15 minutos", // Se puede colocar un HTML en esta parte para que se vean mejor los correos
    };

    // 3- Enviar el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Error sending email" });
      }
      return res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// VERIFICAR EL CÓDIGO QUE ACABAMOS DE ENVIAR
registerCustomerController.verifyCode = async (req, res) => {
  try {
    //Solicitamos el código que escribieron en el frontend
    const { verificationCodeRequest } = req.body;

    // Obtener el token de las cookies
    const token = req.cookies.registrationCookie;

    // Extraer toda la información del token
    const decoded = jsonwebtoken.verify(token, config.JWT.secret);
    const {
      randomNumber: storedCode,
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified,
    } = decoded;

    // Comparar lo que el usuario escribió con el código que está en el token
    if (verificationCodeRequest != storedCode) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // Sí todo está bien, y el usuario escribe el código, lo registramos en la BD
    const NewCustomer = new customerModel({
      name,
      lastName,
      birthdate,
      email,
      password,
      isVerified: true,
    });

    await NewCustomer.save();

    // Limpiar la Cookie
    res.clearCookie("registrationCookie");

    // Retornamos la respuesta del registro exitoso
    return res.status(200).json({ message: "Customer registered" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerCustomerController;