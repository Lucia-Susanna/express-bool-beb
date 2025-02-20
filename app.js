const express = require("express");
require("dotenv").config();
const bebRouter = require("./routes/beb");
const cors = require("cors");
const errorHand = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.get("/", (req, res) => {
  res.send("server dei b&b");
});

app.use("/api/beb", bebRouter);

//notFound
app.use(notFound);

//errorHand
app.use(errorHand);

app.listen(port, () => {
  console.log(`sono in ascolto alla porta ${port}`);
});
