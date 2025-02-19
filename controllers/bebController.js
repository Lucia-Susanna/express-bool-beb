const connection = require("../data/db");

// rotta index
const index = (req, res) => {
  const sql = "SELECT * FROM homes";

  connection.query(sql, (error, result) => {
    if (error) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

const show = (req, res) => {
  const id = req.params.id;

  const sql = `SELECT * FROM homes WHERE id = ?`;
  const sqReviews = `SELECT * FROM reviews WHERE home_id = ?`;

  connection.query(sql, [id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Not found" });

    let dbReviews = result[0];

    connection.query(sqReviews, [id], (error, result) => {
      if (error) return res.status(500).json({ error: error.message });
      dbReviews.reviews = result;

      res.json(dbReviews);
    });
  });
};

const update = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE homes SET ? WHERE id = ?`;

  connection.query(sql, [req.body, id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Modifica effettuata" });
  });
};

const store = (req, res) => {
  res.send("creazione di un b&b");
};

module.exports = {
  index,
  show,
  update,
  store,
};
