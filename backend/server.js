const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const crypto = require('crypto'); // using built-in instead of uuid

const app = express();
const PORT = 3000;

// Base uploads folder
const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Serve uploads statically (must come AFTER uploadFolder is defined)
app.use('/uploads', express.static(uploadFolder));

app.use(cookieParser());

// Middleware to assign a unique userId cookie if not set
app.use((req, res, next) => {
  if (!req.cookies.userId) {
    res.cookie('userId', crypto.randomUUID(), { httpOnly: true });
  }
  next();
});

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.query.userId || req.body.userId;
    if (!userId) return cb(new Error('Missing userId'));

    const userFolder = path.join(uploadFolder, userId);
    if (!fs.existsSync(userFolder)) fs.mkdirSync(userFolder, { recursive: true });

    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg', '.pdf', '.txt'];
    if (allowedTypes.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully!');
});

// List user files
app.get('/files', (req, res) => {
  const userId = req.query.userId || req.body.userId;
  if (!userId) return res.status(400).send('Missing userId');

  const userFolder = path.join(uploadFolder, userId);
  if (!fs.existsSync(userFolder)) {
    return res.json([]);
  }

  fs.readdir(userFolder, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading files');
    }
    res.json(files);
  });
});

// Serve index.html and other static files
app.use(express.static(__dirname));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
