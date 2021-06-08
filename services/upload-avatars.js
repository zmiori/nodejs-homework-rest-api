require("dotenv").config();

const path = require("path");
const fs = require("fs/promises");

const Jimp = require("jimp");
const createFolderIsNotExist = require("../helpers/create-dir");

class UploadAvatar {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {
    const file = await Jimp.read(pathFile);
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(pathFile);
  }

  async saveAvatarToStatic({ userId, pathFile, name, oldFile }) {
    await this.transformAvatar(pathFile);
    const folderUserAvatar = path.join(this.AVATARS_OF_USERS, userId);
    await createFolderIsNotExist(folderUserAvatar);
    await fs.rename(pathFile, path.join(folderUserAvatar, name));
    await this.deletOldAvatar(
      path.join(process.cwd(), this.AVATARS_OF_USERS, oldFile)
    );

    const avatarURL = path.normalize(path.join(userId, name));
    return avatarURL;
  }

  async deletOldAvatar(pathFile) {
    try {
      await fs.unlink(pathFile);
    } catch (e) {
      console.log(e.message);
    }
  }
}

module.exports = UploadAvatar;
