const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const HelloRoutes = require('./routes/HelloRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');

const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost',
    credentials: true,
}));
app.use('/api', HelloRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
