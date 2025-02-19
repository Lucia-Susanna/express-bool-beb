const express = require('express')
require('dotenv').config()
const bebRouter = require('./routes/beb')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('server dei b&b')
})

app.use('/api/beb', bebRouter)

app.listen(port, () => {
  console.log(`sono in ascolto alla porta ${port}`);

})