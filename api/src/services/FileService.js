const path = require('path');
const fs = require('fs').promises;
const { models } = require('../models');

class FileService {
  constructor() {
    this.paths = {
      userImage: path.join(process.cwd(), 'files', 'usersImage'),
      userPDF: path.join(process.cwd(), 'files', 'usersPDF'),
      skillImage: path.join(process.cwd(), 'files', 'skillImage')
    };

    this.errorMessages = {
      entityNotFound: {
        user: 'Користувача не знайдено',
        skill: 'Навичку не знайдено'
      },
      fileNotUploaded: 'Файл не завантажено'
    };
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
      const relativeFilePath = path.join('files', path.basename(uploadPath), fileName);
      const filePath = path.join(uploadPath, fileName);

      await this.deleteExistingFile(modelInstance[fileField]);
      await fs.writeFile(filePath, file.buffer);
      await modelInstance.update({ [fileField]: relativeFilePath });

      return relativeFilePath;
    } catch (error) {
      console.error('Помилка завантаження файлу:', error);
      throw error;
    }
  }

  async deleteFile(modelInstance, fileField, errorMessage) {
    if (!modelInstance) {
      throw new Error(errorMessage);
    }

    if (modelInstance[fileField]) {
      await this.deleteExistingFile(modelInstance[fileField]);
    }

    await modelInstance.update({ [fileField]: null });
  }

  async deleteExistingFile(filePath) {
    if (!filePath) return;

    const fullPath = path.join(process.cwd(), filePath);
    try {
      await fs.access(fullPath);
      await fs.unlink(fullPath);
      console.log('Файл успішно видалено:', fullPath);
    } catch (error) {
      console.error('Помилка видалення файлу:', error);
    }
  }

  async ensureUploadDirectoryExists(uploadPath) {
    try {
      await fs.access(uploadPath);
    } catch (error) {
      await fs.mkdir(uploadPath, { recursive: true });
    }
  }

  async getModelInstance(modelName, id) {
    const model = await models[modelName].findOne({ where: { id } });
    if (!model) {
      throw new Error(this.errorMessages.entityNotFound[modelName.toLowerCase()]);
    }
    return model;
  }

  async uploadImage(userId, file) {
    const user = await this.getModelInstance('User', userId);
    return this.uploadFile({
      modelInstance: user,
      file,
      uploadPath: this.paths.userImage,
      fileNamePrefix: 'user',
      fileField: 'image'
    });
  }

  async uploadPDF(userId, file) {
    const user = await this.getModelInstance('User', userId);
    return this.uploadFile({
      modelInstance: user,
      file,
      uploadPath: this.paths.userPDF,
      fileNamePrefix: 'user',
      fileField: 'file',
      forcedExtension: '.pdf'
    });
  }

  async uploadSkillImage(skillId, file) {
    const skill = await this.getModelInstance('Skill', skillId);
    return this.uploadFile({
      modelInstance: skill,
      file,
      uploadPath: this.paths.skillImage,
      fileNamePrefix: 'skill',
      fileField: 'image'
    });
  }

  async deleteImage(userId) {
    const user = await this.getModelInstance('User', userId);
    await this.deleteFile(user, 'image', this.errorMessages.entityNotFound.user);
  }

  async deletePDF(userId) {
    const user = await this.getModelInstance('User', userId);
    await this.deleteFile(user, 'file', this.errorMessages.entityNotFound.user);
  }

  async deleteSkillImage(skillId) {
    const skill = await this.getModelInstance('Skill', skillId);
    await this.deleteFile(skill, 'image', this.errorMessages.entityNotFound.skill);
  }
}

module.exports = new FileService();