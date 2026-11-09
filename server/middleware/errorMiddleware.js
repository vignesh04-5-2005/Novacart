const errorHandler = (err, req, res, next) => {
  // Preserve an explicitly selected status code; otherwise treat it as a server error.
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500 && process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Server Error",
  });
};

module.exports = errorHandler;
