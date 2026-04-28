/*
    Campos:
        name
        lastName
        email
        password
        isActive
        isVerified
        loginAttempts
        timeOut
*/

import { Schema, model } from "mongoose";

const teachersSchema = new Schema({
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
  isActive: {
    type: Boolean,
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
}, {
  timestamps: true, // Guardar el momento exacto en el que se guardo y cuantas versiones tiene
  strict: false, // Para lograr agregar campos nuevos
});

export default model("Teachers", teachersSchema);
