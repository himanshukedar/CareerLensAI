const errorMiddleware = (err, req, res, next) => {
    console.error(`[Error] ${err.stack}`);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        msg: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorMiddleware;
