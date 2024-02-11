const urlInfo = (url) => {
  // Regular expression to match Google Drive file or folder URL
  const driveRegex = /^https?:\/\/drive\.google\.com\/(?:open\?(?:[\w-]+\=[^&]+&)*id=|.*?\/(?:folders|file)\/|drive\/folders\/)?([\w-]+)/;

  const match = url.match(driveRegex);

  if (!match) {
    return {
      isValid: false,
      message: 'Not a valid Google Drive URL.',
    };
  }

  const fileId = url.split('/')[5];

  // Check if the URL represents a folder or a file
  const isFolder = url.includes('/folders/') || url.includes('/drive/folders/');

  return {
    isValid: true,
    isFolder: isFolder,
    fileId: fileId,
  };
};

function getDownloadUrl(url) {
  let checkUrl = urlInfo(url);

  if (!checkUrl.isValid) {
    console.error(checkUrl.message);
  } else if (checkUrl.isFolder) {
    console.error("Sorry! Google Drive's Folder can't be downloaded.");
  } else {
    return `https://drive.google.com/uc?export=download&id=${checkUrl.fileId}`;
  }
}

module.exports = { urlInfo, getDownloadUrl };
