const notfound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statuscode = res.statuscode === 200 ? 500 : res.statuscode;
  let message = err.message;

  //   check for Mongoose bad ObjectID
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = `Resource not found`;
    statuscode = 404;
  }

  //   respond to client
  res.status(statuscode).json({ message });
};

export { notfound, errorHandler };
