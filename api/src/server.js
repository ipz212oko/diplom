const app = require('./app');
const { connectDB } = require('./config/database');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function syncDatabase() {
    try {
        await sequelize.sync({ force: false });
        console.log('All tables have been created or are already existing.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
}

connectDB()
    .then(async () => {
      await syncDatabase();
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to the database:', err);
    });
