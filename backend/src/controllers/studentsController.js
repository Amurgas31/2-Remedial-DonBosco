import studentsModel from "../models/students.js";

// Array de funciones
const studentsController = {};

// SELECT
studentsController.getStudents = async (req, res) => {
  try {
    const students = await studentsModel.find();
    return res.status(200).json(students);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
studentsController.updateStudent = async (req, res) => {
  try {
    // 1- Solicitamos los nuevos datos
    let {
      name,
      lastName,
      email,
      password,
      career,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    // Validaciones
    name = name?.trim();
    lastName = lastName?.trim();
    email = email?.trim();

    // Valores requeridos
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ message: "Fields required" });
    }

    const studentUpdated = await studentsModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        lastName,
        email,
        password,
        career,
        isVerified,
        loginAttempts,
        timeOut,
      },
      { new: true },
    );

    if (!studentUpdated) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ message: "Student Updated" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// DELETE
studentsController.deleteStudent = async (req, res) => {
  try {
    const deleteStudent = studentsModel.findByIdAndDelete(req.params.id);

    // Si no se elimina es por que no encontró el id
    if (!deleteStudent) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    return res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default studentsController;
