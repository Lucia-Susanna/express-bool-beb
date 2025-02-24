const connection = require("../data/db");

// rotta index
const index = (req, res) => {
  const { city, minRooms, maxRooms } = req.query;

  let sql = `SELECT homes.*, ROUND(AVG(reviews.vote), 0) AS avg_vote, hosts.id AS host_id, hosts.name AS host_name, hosts.surname AS host_surname, hosts.email AS host_mail, hosts.phone AS host_phone
  FROM homes
  LEFT JOIN reviews ON homes.id = reviews.home_id
  LEFT JOIN hosts ON homes.host_id = hosts.id`;

  let conditions = [];
  let values = [];

  if (city) {
    conditions.push("homes.address LIKE ?");
    values.push(`%, ${city}%`);
  }

  if (minRooms) {
    conditions.push("homes.rooms >= ?");
    values.push(minRooms);
  }

  if (maxRooms) {
    conditions.push("homes.rooms <= ?");
    values.push(maxRooms);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " GROUP BY homes.id";

  const sqlImg = `SELECT home_id, url FROM images`;

  connection.query(sql, values, (error, result) => {
    if (error) return res.status(500).json({ error: error.message });

    connection.query(sqlImg, (error, imgResult) => {
      if (error) return res.status(500).json({ error: error.message });

      const homes = result.map((home) => {
        return {
          ...home,
          imgs: imgResult
            .filter((img) => img.home_id === home.id)
            .map((img) => img.url),
        };
      });

      res.json(homes);
    });
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
  store,
  storeReview,
};
