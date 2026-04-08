import ApiModel from "../models/api.js";

// Se crea un nuevo registro de API
export const createApi = async (req, res) => {
  try {
    // Se crea un nuevo documento con los datos enviados
    // req.user.id viene del token JWT decodificado
    // Se copian todos los datos del cuerpo (name, status, species, image)
    // Se asigna automáticamente el ID del usuario autenticado
    const newApi = new ApiModel({
      ...req.body,
      userId: req.user.id
    });
    // Se almacena en la base de datos
    const saved = await newApi.save();
    // Se retorna el documento creado con código 201 (Created)
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error al crear API", error });
  }
};

// Se obtienen todas las APIs creadas por el usuario autenticado
export const getApis = async (req, res) => {
  try {
    // Se buscan todas las APIs cuyo userId coincida con el del usuario autenticado
    // -1 en sort ordena de mayor a menor (más recientes primero)
    const data = await ApiModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener APIs", error });
  }
};

// Se obtiene un API específica por su ID (solo si el usuario autenticado es el propietario)
export const getApiById = async (req, res) => {
  try {
    // Se busca la API por ID y se verifica que pertenece al usuario autenticado
    const apiDoc = await ApiModel.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    // Si no existe o no tiene permiso
    if (!apiDoc) {
      return res.status(404).json({ message: "API no encontrada o no tienes permiso" });
    }

    res.json(apiDoc);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar API", error });
  }
};

// Se actualiza una API existente (solo el propietario puede actualizar su API)
// ACTUALIZAR
export const updateApi = async (req, res) => {
  try {
    // Se verifica primero que la API existe y pertenece al usuario
    const apiDoc = await ApiModel.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    // Si no existe o no tiene permiso
    if (!apiDoc) {
      return res.status(404).json({ message: "API no encontrada o no tienes permiso" });
    }

    // Se actualiza el documento en la base de datos
    // { new: true } retorna el documento actualizado en lugar del anterior
    const updated = await ApiModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar API", error });
  }
};

// Se elimina una API existente (solo el propietario puede eliminar su API)
export const deleteApi = async (req, res) => {
  try {
    // Se verifica primero que la API existe y pertenece al usuario
    const apiDoc = await ApiModel.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    // Si no existe o no tiene permiso
    if (!apiDoc) {
      return res.status(404).json({ message: "API no encontrada o no tienes permiso" });
    }

    // Se elimina el documento de la base de datos
    const deleted = await ApiModel.findByIdAndDelete(req.params.id);

    res.json({ message: "API eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar API", error });
  }
};