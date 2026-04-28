import teachersModel from "../models/teachers.js";

// Array de funciones
const teachersController = {};

// SELECT
teachersController.getTeachers = async (req, res) => {
  try {
    const teachers = await teachersModel.find();
    return res.status(200).json(teachers);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
teachersController.updateTeacher = async (req, res) => {
  try {
    // 1- Solicitamos los nuevos datos
    let {
      name,
      lastName,
      email,
      password,
      isActive,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    // Validaciones
    name = name?.trim();
    email = email?.trim();
    lastName = lastName?.trim();

    // Valores requeridos
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    const teacherUpdated = await teachersModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        email,
        password,
        isActive,
        isVerified,
        loginAttempts,
        timeOut,
      },
      { new: true },
    );

    if (!teacherUpdated) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    return res.status(200).json({ message: "Teacher Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE
teachersController.deleteTeacher = async (req, res) => {
  try {
    const deleteTeacher = teachersModel.findByIdAndDelete(req.params.id);

    // Si no se elimina es por que no encontró el id
    if (!deleteTeacher) {
      return res.status(404).json({ message: "Teacher Not Found" });
    }

    return res.status(200).json({ message: "Teacher Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default teachersController;