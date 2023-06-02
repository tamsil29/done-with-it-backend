const { google } = require("googleapis");
const path = require("path");

const getDriveService = () => {
  const KEYFILEPATH = process.env.NODE_ENV === 'production' ? '/etc/secrets/gDriveService.json' : path.join(__dirname, "gDriveService.json");
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: "v3", auth });
  return driveService;
};

module.exports = getDriveService;
