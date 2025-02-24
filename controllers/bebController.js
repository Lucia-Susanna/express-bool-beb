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

  const sql = `SELECT homes.*, hosts.id AS host_id, hosts.name AS host_name, hosts.surname AS host_surname, hosts.phone AS host_phone, hosts.email AS host_mail
              FROM homes
              LEFT JOIN hosts ON homes.host_id = hosts.id
              WHERE homes.id = ?`;

  const sqlReviews = `SELECT * FROM reviews WHERE home_id = ?`;
  const sqlImgs = `SELECT * FROM images WHERE home_id = ?`;

  connection.query(sql, [id], (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Not found" });

    let dbReviews = result[0];

    connection.query(sqlReviews, [id], (error, reviewResult) => {
      if (error) return res.status(500).json({ error: error.message });
      dbReviews.reviews = reviewResult;
    });

    connection.query(sqlImgs, [id], (error, imgResult) => {
      if (error) return res.status(500).json({ error: error.message });
      const imgData = imgResult.map((img) => ({
        ...img,
        url: `${req.imagePath}/${img.url}`,
      }));
      dbReviews.images = imgData.map((img) => img.url);
      res.json(dbReviews);
    });
  });
};

//updateLikes

const updateLikes = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE homes 
SET likes = likes + 1 
WHERE id = ?;`;

  connection.query(sql, [id], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: `hai aggiunto un like alla casa con id ${id}` });
  });
};

//store
const storeHomes = (req, res) => {
  const {
    host_id,
    description,
    rooms,
    beds,
    restrooms,
    square_meters,
    address,
  } = req.body;

  const sql = `INSERT INTO homes ( host_id, description, rooms, beds, restrooms, square_meters, address, likes) VALUES
 (?, ?, ?, ?, ?, ?, ?, 0)`;

  connection.query(
    sql,
    [host_id, description, rooms, beds, restrooms, square_meters, address],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Query errata" });
      }
      res.status(201).json({ message: "home added" });
    }
  );
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
  updateLikes,
  storeHomes,
  storeReview,
};
