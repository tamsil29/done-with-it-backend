const drive = require("./drive-auth.service")();
const stream = require("stream");

const driveFolders = {
  uploads: "1HgsxqRWcXwAf-I1pOu9fVybCqgiM6RBU",
  doneWithIt: '1G_GkaOaPq4aAiRxyWT3KgXGFsfMl0tx8'
};

async function uploadFile(fileObject) {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);

  const { data } = await drive.files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [driveFolders.doneWithIt],
    },
  });

  return await generatePublicUrl(data);
}

async function generatePublicUrl(data) {
  const response = await drive.permissions.create({
    fileId: data.id,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });
  if (response.status === 200) {
    return data;
  }
}

async function deleteFile(id) {
  const response = await drive.files.delete({
    fileId: id,
  });

  if (response.status === 204) return true;
  console.log(response);
}

//listing all the folder and files in drive
async function listFiles() {
  const res = await drive.files.list({
    // pageSize: 10,
    // fields: "nextPageToken, files(id, name)",
  });
  const files = res.data;
  if (files.length === 0) {
    console.log("No files found.");
    return;
  }
  console.log(files);
}

// listFiles()

module.exports.uploadFileToDrive = uploadFile;
module.exports.deleteFileFromDrive = deleteFile;
module.exports.listFilesInDrive = listFiles;
