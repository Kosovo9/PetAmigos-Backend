const jwt = require('jsonwebtoken');



// Middleware para verificar el Token JWT en cada solicitud

const auth = async (req, res, next) => {

  try {

    // 1. Verificar que existe el header de autorización

    if (!req.headers.authorization) {

      return res.status(401).json({ message: "Acceso denegado: Token de sesión requerido." });

    }

    

    // 2. Obtener el token del header (Ej: "Bearer token...")

    const token = req.headers.authorization.split(" ")[1];

    

    if (!token) {

      return res.status(401).json({ message: "Acceso denegado: Token de sesión requerido." });

    }



    // 3. Verificar si es nuestro token (JWT_SECRET)

    let decodedData = jwt.verify(token, process.env.JWT_SECRET);



    // 4. Pasar el ID de usuario a la solicitud para usarlo en los controladores

    req.userId = decodedData.id;



    next();

  } catch (error) {

    // Si el token es inválido o no existe, denegar acceso

    console.error("TOKEN INVALIDO:", error.message);

    res.status(401).json({ message: "Acceso denegado: Token de sesión inválido o expirado." });

  }

};



module.exports = auth;

