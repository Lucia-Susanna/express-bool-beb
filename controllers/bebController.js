const connection = require("../data/db");

// rotta index
const index = (req, res) => {
  const { city, minRooms, maxRooms, minBeds, maxBeds, guest, minRestrooms, maxRestrooms } = req.query;

  let sql = `SELECT homes.*, ROUND(AVG(reviews.vote), 0) AS avg_vote
  FROM homes
  LEFT JOIN reviews ON homes.id = reviews.home_id`;

  let conditions = [];
  let values = [];

  if (city) {
    conditions.push("homes.city LIKE ?");
    values.push(`%${city}%`);
  }

  if (guest) {
    conditions.push("homes.guest_number = ?");
    values.push(guest);
  }

  if (minRooms) {
    conditions.push("homes.rooms >= ?");
    values.push(minRooms);
  }

  if (maxRooms) {
    conditions.push("homes.rooms <= ?");
    values.push(maxRooms);
  }

  if (minBeds) {
    conditions.push("homes.beds >= ?");
    values.push(minBeds);
  }

  if (maxBeds) {
    conditions.push("homes.beds <= ?");
    values.push(maxBeds);
  }

  if (minRestrooms) {
    conditions.push("homes.restrooms >= ?");
    values.push(minRestrooms);
  }

  if (maxRestrooms) {
    conditions.push("homes.restrooms <= ?");
    values.push(maxRestrooms);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " GROUP BY homes.id ORDER BY homes.likes DESC";

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

//show
const show = (req, res) => {
  const id = req.params.id;

  const sql = `SELECT *
              FROM homes
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

      connection.query(sqlImgs, [id], (error, imgResult) => {
        if (error) return res.status(500).json({ error: error.message });
        dbReviews.images = imgResult.map((img) => img.url);
        res.json(dbReviews);
      });
    });
  });
};

//updateLikes
const updateLikes = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE homes SET likes = likes + 1 WHERE id = ?`;

  connection.query(sql, [id], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: `hai aggiunto un like alla casa con id ${id}` });
  });
};

//storeHomes
const storeHomes = (req, res) => {
  const {
    description, rooms, beds, restrooms, square_meters, address, host_name, host_surname, host_email, host_phone, thumbnail
  } = req.body;

  const sql = `INSERT INTO homes (description, rooms, beds, restrooms, square_meters, address, likes, host_name, host_surname, host_email, host_phone, thumbnail) VALUES
(?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [description, rooms, beds, restrooms, square_meters, address, host_name, host_surname, host_email, host_phone, thumbnail],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Query errata" });
      }
      res.status(201).json({ message: "home added" });
    }
  );
};

//storeReview
const storeReview = (req, res) => {
  const id = req.params.id;

  const { name, surname, vote, text, check_in_date, stay_duration } = req.body;

  const sql =
    `INSERT INTO reviews (home_id, name, surname, vote, text, check_in_date, stay_duration) VALUES
  (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(sql, [id, name, surname, vote, text, check_in_date, stay_duration], (err, results) => {
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
