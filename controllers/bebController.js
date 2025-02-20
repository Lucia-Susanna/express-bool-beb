const connection = require("../data/db");

// rotta index
const index = (req, res) => {
  const sqlAvg = `SELECT homes.*, ROUND(AVG(reviews.vote), 0) AS avg_vote
  FROM homes
  LEFT JOIN reviews ON homes.id = reviews.home_id
  GROUP BY homes.id`;

  const sqlImg = `SELECT home_id, url 
  FROM images`;

  connection.query(sqlAvg, (error, result) => {
    if (error) return res.status(500).json({ error: error.message });

    connection.query(sqlImg, (error, imgResult) => {
      if (error) return res.status(500).json({ error: error.message });
      const urlImg = imgResult.map(img => img.url)
      const homes = result.map(home => {
        return {
          ...home,
          imgs: imgResult.filter(img => img.home_id === home.id).map(img => img.url)
        };
      });
      res.json(homes);
    });
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

//updateLikes

const updateLikes = (req, res) => {
  const id = req.params.id;
  const sql = `UPDATE homes 
SET likes = likes + 1 
WHERE id = ?;`

  connection.query(sql, [id], (error, results) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: `hai aggiunto un like alla casa con id ${id}` });
  })
}


//store
const storeHomes = (req, res) => {
  const { host_id, description, rooms, beds, restrooms, square_meters, address } = req.body;

  const sql = `INSERT INTO homes ( host_id, description, rooms, beds, restrooms, square_meters, address, likes) VALUES
 (?, ?, ?, ?, ?, ?, ?, 0)`

  connection.query(sql, [host_id, description, rooms, beds, restrooms, square_meters, address], (err, results) => {
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
  updateLikes,
  storeHomes,
  storeReview
};
