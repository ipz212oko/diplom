const path = require('path');
const fs = require('fs').promises;
const { models } = require('../models');

class FileService {
  constructor() {
    this.imageUploadPath = path.join(process.cwd(), 'files', 'usersImage');
    this.pdfUploadPath = path.join(process.cwd(), 'files', 'usersPDF');
    this.skillImagePath = path.join(process.cwd(), 'files', 'skillImage');
  }

  async uploadFile({
    modelInstance,
    file,
    uploadPath,
    fileNamePrefix,
    fileField,
    forcedExtension = null
  }) {
    try {
      await this.ensureUploadDirectoryExists(uploadPath);

      if (!modelInstance) {
        throw new Error('Сутність не знайдено');
      }

      const fileExtension = forcedExtension || path.extname(file.originalname);
      const fileName = `${fileNamePrefix}_${modelInstance.id}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadPath, fileName);

      await fs.writeFile(filePath, file.buffer);

      if (modelInstance[fileField]) {
        const oldFilePath = path.join(uploadPath, modelInstance[fileField]);
        try {
          await fs.unlink(oldFilePath);
        } catch (error) {
          console.error('Помилка видалення старого файлу:', error);
        }
      }

      await modelInstance.update({ [fileField]: fileName });

      return fileName;
    } catch (error) {
      console.error('Помилка завантаження файлу:', error);
      throw error;
    }
  }

  async uploadSkillImage(skillId, file) {
    const skill = await models.Skill.findByPk(skillId);
    return this.uploadFile({
      modelInstance: skill,
      file,
      uploadPath: this.skillImagePath,
      fileNamePrefix: 'skill',
      fileField: 'image'
    });
  }

  async uploadImage(userId, file) {
    const user = await models.User.findByPk(userId);
    return this.uploadFile({
      modelInstance: user,
      file,
      uploadPath: this.imageUploadPath,
      fileNamePrefix: 'user',
      fileField: 'image'
    });
  }

  async uploadPDF(userId, file) {
    const user = await models.User.findByPk(userId);
    return this.uploadFile({
      modelInstance: user,
      file,
      uploadPath: this.pdfUploadPath,
      fileNamePrefix: 'user',
      fileField: 'file',
      forcedExtension: '.pdf'
    });
  }

  async ensureUploadDirectoryExists(uploadPath) {
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
  }
}

module.exports = new FileService();