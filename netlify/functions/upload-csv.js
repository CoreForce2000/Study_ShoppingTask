const { google } = require("googleapis");
const fs = require("fs");
const os = require("os");

// This handler runs each time the function is called:
exports.handler = async (event) => {
  // Parse JSON body (Netlify uses raw event.body)
  const { csvContent, filename } = JSON.parse(event.body);

  if (!csvContent || !filename) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing csvContent or filename" }),
    };
  }

  // ✅ Use service account credentials from env var (secure!)
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });

  // Save temp file in Lambda's tmp dir:
  const tempPath = `${os.tmpdir()}/${filename}`;
  fs.writeFileSync(tempPath, csvContent);

  try {
    const fileMetadata = {
      name: filename,
      parents: [process.env.FOLDER_ID],
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        fileId: file.data.id,
        webViewLink: file.data.webViewLink,
      }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to upload file",
        details: err.message,
      }),
    };
  } finally {
    fs.unlinkSync(tempPath);
  }
};
