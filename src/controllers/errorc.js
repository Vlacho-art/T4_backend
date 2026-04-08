import ErrorLog from "../models/error.js";

// Se crea un nuevo registro de error en la base de datos
export const createError = async (req, res) => {
  try {
    // Se crea un nuevo documento con los datos del error
    // req.user.id viene del token JWT decodificado
    // Se copian datos: código, mensaje, modulo, stack_trace, metadata
    // Se asigna automáticamente el ID del usuario autenticado
    const newError = new ErrorLog({
      ...req.body,
      userId: req.user.id
    });
    // Se almacena el registro de error en la base de datos
    const saved = await newError.save();
    // Se retorna el documento creado con código 201 (Created)
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error al crear", error });
  }
};

// Se obtienen todos los registros de error del usuario autenticado
export const getErrors = async (req, res) => {
  try {
    // Se buscan todos los errores cuyo userId coincida con el del usuario autenticado
    // -1 en sort ordena por fecha descendente (más recientes primero)
    const data = await ErrorLog.find({ userId: req.user.id }).sort({ fecha: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener", error });
  }
};

// Se actualiza un registro de error existente (solo el propietario puede actualizar)
export const updateError = async (req, res) => {
  try {
    // Se verifica primero que el error existe y pertenece al usuario
    const error = await ErrorLog.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    // Si no existe o no tiene permiso
    if (!error) {
      return res.status(404).json({ message: "No encontrado o no tienes permiso" });
    }

    // Se actualiza el documento en la base de datos
    // { new: true } retorna el documento actualizado
    const updated = await ErrorLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar", error });
  }
};

// Se elimina un registro de error existente (solo el propietario puede eliminar)
export const deleteError = async (req, res) => {
  try {
    // Se verifica primero que el error existe y pertenece al usuario
    const error = await ErrorLog.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    // Si no existe o no tiene permiso
    if (!error) {
      return res.status(404).json({ message: "No encontrado o no tienes permiso" });
    }

    // Se elimina el documento de la base de datos
    const deleted = await ErrorLog.findByIdAndDelete(req.params.id);

    res.json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error });
  }
};