const notfound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  //  Always fallback to 500 if no status is set or it's 200
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  //   check for Mongoose bad ObjectID
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found`;
    statusCode = 404;
  }

  //   respond to client
  res.status(statusCode).json({ message });
};

export { notfound, errorHandler };
