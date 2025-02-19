const connection = require('../data/db')

// rotta index
const index = (req, res) => {
  res.send('elenco dei b&b')
}

module.exports = {
  index
}