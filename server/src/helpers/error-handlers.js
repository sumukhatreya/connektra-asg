export const notFound = (req, res, next) => {
    const err = new Error(`${req.originalUrl} not found`);
    res.status(404);
    next(err);
}

export const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'DEVELOPMENT' ? error.stack : ''
    });
}