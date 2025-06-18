// server.js
const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const fs = require("fs");
const os = require("os");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(bodyParser.json({ limit: "10mb" }));

// Load your service account key file
const auth = new google.auth.GoogleAuth({
  keyFile: "secret.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

// Drive client
const drive = google.drive({ version: "v3", auth });

app.post("/upload-csv", async (req, res) => {
  const { csvContent, filename } = req.body;

  if (!csvContent || !filename) {
    return res.status(400).json({ error: "Missing csvContent or filename" });
  }

  // Save CSV to a temp file

  const tempPath = `${os.tmpdir()}/${filename}`;

  fs.writeFileSync(tempPath, csvContent);

  try {
    const fileMetadata = {
      name: filename,
      parents: ["1PQgNO3vP8AdBL7YoDZbkGHgCqwmaE8Rk"],
    };
    const media = {
      mimeType: "text/csv",
      body: fs.createReadStream(tempPath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink",
    });

    console.log("Uploaded file:", file.data);
    res.json({
      success: true,
      fileId: file.data.id,
      webViewLink: file.data.webViewLink,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to upload file", details: err.message });
  } finally {
    fs.unlinkSync(tempPath);
  }
});

app.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
