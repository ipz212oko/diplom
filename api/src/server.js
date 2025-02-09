const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('All tables have been created or are already existing.');
  } catch (error) {
    console.error('Error synchronizing models:', error);
  }
}

async function startServer() {
  try {

    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await syncDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database:', err);
  }
}

startServer();
