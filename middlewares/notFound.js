const notFound = (req, res, next) => {
  res.status(404);
  res.json({
    message: "risorsa non trovata",
    status: 404,
    error: "Not Found",
  });
};

module.exports = notFound;