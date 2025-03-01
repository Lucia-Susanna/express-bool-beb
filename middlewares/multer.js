const multer = require('multer')

const storage = multer.diskStorage({
  destination: "./public/img",
  filename: (req, file, cb) => {
    console.log(file);

    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName)
    console.log();

  }
})

const upload = multer({ storage });

module.exports = upload;