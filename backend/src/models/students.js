/*
    Campos:
        name
        lastName
        email
        password
        career
        isVerified
        loginAttempts
        timeOut
*/

import { Schema, model } from "mongoose";

const studentsSchema = new Schema(
  {
    name: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    career: {
      type: String,
    },
    isVerified: {
      type: Boolean,
    },
    loginAttempts: {
      type: Number,
    },
    timeOut: {
      type: Date,
    },
  },
  {
    timestamps: true, // Guardar el momento exacto en el que se guardo y cuantas versiones tiene
    strict: false, // Para lograr agregar campos nuevos
  },
);

export default model("Students", studentsSchema);
