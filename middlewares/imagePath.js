const setImagePath = (req, res, next) => {
  req.imagePath = `${req.protocol}://${req.get('host')}`
  next()
}

module.exports = setImagePath