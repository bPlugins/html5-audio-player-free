const rimraf = require("rimraf");
const fs = require("fs");

function deleteFolders() {
  rimraf("bundled", () => {});
  rimraf("languages", () => {});
  rimraf("dist", () => {});
}

module.exports.deleteFiles = deleteFolders;

async function copyFiles() {
  try {
    await fs.promises.copyFile("blocks/audioplayer/blocks.asset.php", "dist/blocks.asset.php");
    await fs.promises.copyFile("blocks/mp3-player/editor.asset.php", "dist/editor.asset.php");
    console.log("copy file to dist");
  } catch (error) {
    console.log("The file could not be copied", error);
  }
}
// copyFiles();
module.exports.copyFiles = copyFiles;
