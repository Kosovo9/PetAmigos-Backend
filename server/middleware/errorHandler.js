// Error handler centralizado para Express
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error
    if (err.statusCode >= 500) {
        console.error('ERROR 💥:', {
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip
        });
    }

    if (process.env.NODE_ENV === 'development') {
        // Desarrollo: enviar todo
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
            url: req.originalUrl
        });
    } else {
        // Producción: solo errores operacionales
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            // Error de programación - no revelar detalles
            res.status(500).json({
                status: 'error',
                message: 'Algo salió mal en el servidor'
            });
        }
    }
};

// Wrapper para async functions
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

// Manejo de rutas no encontradas
const notFound = (req, res, next) => {
    const err = new AppError(`No se encontró ${req.originalUrl}`, 404);
    next(err);
};

module.exports = {
    AppError,
    errorHandler,
    catchAsync,
    notFound
};
