import { commands } from "./main.js";

function createServer() {
    // --- Collect dynamic command names ---
    const allowedCommands = commands.map(c => c.name);

    console.log(allowedCommands);

    // --- Collect all file extensions allowed from commands' FileTypes arrays ---
    const allowedExtensions = Array.from(
      new Set(
        commands
          .flatMap(c => c.FileTypes || []) // take all extensions from each command
          .map(ext => ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`) // ensure they start with a dot
      )
    );

    // --- Default file extensions if none found ---
    if (allowedExtensions.length === 0) {
        allowedExtensions.push('.txt', '.pdf', '.png', '.jpg');
    }

    const serverContent = `
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

const uploadFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

app.use('/uploads', express.static(uploadFolder));

// Multer storage config
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

// Dynamic allowed filetypes from command definitions
const allowedFileTypes = ${JSON.stringify(allowedExtensions, null, 2)};

// Multer instance
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: ' + ext));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

// Run command dynamically
app.post('/run', express.json(), (req, res) => {
  const { command } = req.body;

  if (!command) return res.status(400).send('Missing command');

  const allowed = ${JSON.stringify(allowedCommands, null, 2)};
  const parts = command.trim().split(/\\s+/);
  if (!allowed.includes(parts[0])) {
    return res.status(403).send('Command not allowed');
  }

  exec(command, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send(stderr || err.message);
    }
    res.setHeader('Content-disposition', 'attachment; filename=result.txt');
    res.setHeader('Content-Type', 'text/plain');
    res.send(stdout);
  });
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

app.use(express.static(__dirname));

app.listen(PORT, () => console.log(\`Server running at http://localhost:\${PORT}\`));
`;

    downloadFile("server.js", serverContent);
}

// Helper to trigger download
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

export { createServer };
