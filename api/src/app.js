const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const HelloRoutes = require('./routes/HelloRoutes');
const AuthRoutes = require('./routes/AuthRoutes');
const UserRoutes = require('./routes/UserRoutes');
const SkillRoutes = require('./routes/SkillRoutes');
const UsersSkillsRoutes = require('./routes/UsersSkillsRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost',
    credentials: true,
}));
app.use('/api', HelloRoutes);
app.use('/api', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/skills', SkillRoutes);
app.use('/api/users-skills', UsersSkillsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
