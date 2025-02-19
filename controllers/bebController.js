const connection = require('../data/db')

const index = (req, res) => {
  res.send('elenco dei b&b')
}

module.exports = {
  index
}