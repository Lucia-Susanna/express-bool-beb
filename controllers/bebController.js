const connection = require("../data/db");

// rotta index
const index = (req, res) => {
  const sql = "SELECT * FROM homes";

  connection.query(sql, (error, result) => {
    if (error) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

//show
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

//update
const update = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE homes SET ? WHERE id = ?`;

  connection.query(sql, [req.body, id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Modifica effettuata" });
  });
};

//store
const storeHomes = (req, res) => {
  const { id, host_id, description, rooms, beds, restrooms, square_meters, address, likes } = req.body;

  const sql = `INSERT INTO homes (id, host_id, description, rooms, beds, restrooms, square_meters, address, likes) VALUES
 (?, ?, ?, ?, ?, ?, ?, ?, ?)`

  connection.query(sql, [id, host_id, description, rooms, beds, restrooms, square_meters, address, likes], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Query errata" });
    }
    res.status(201).json({ message: 'home added' })
  })

};

//store review
const storeReview = (req, res) => {
  const id = req.params.id;

  const { name, surname, vote, text } = req.body;

  const sql =
    "INSERT INTO reviews (name, surname, vote, text, home_id) VALUES(?, ?, ?, ?, ?)";

  connection.query(sql, [name, surname, vote, text, id], (err, results) => {
    if (err) return res.status(500).json({ error: "query fallita", err });
    res.status(201);
    console.log(results);

    res.json({ message: "Review added", id: results.insertId });
  });
};

module.exports = {
  index,
  show,
  update,
  storeHomes,
  storeReview
};
