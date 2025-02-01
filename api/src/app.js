const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
const {
    HelloRoutes,
    AuthRoutes,
    UserRoutes,
    SkillRoutes,
    UsersSkillsRoutes,
    ComplaintRoutes,
    UserComplainRoutes,
    StatusRoutes,
    OrderRoutes,
    OrdersSkillRoutes,
    OrderHistoryRoutes,
    RoomsRoutes,
    CommentRoutes,
    MessagesRoutes
} = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost',
    credentials: true,
}));
app.use('/api', HelloRoutes);
app.use('/api/login', AuthRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/skills', SkillRoutes);
app.use('/api/users-skills', UsersSkillsRoutes);
app.use('/api/complaints', ComplaintRoutes);
app.use('/api/user-complaints', UserComplainRoutes);
app.use('/api/statuses', StatusRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/orders-skills', OrdersSkillRoutes);
app.use('/api/order-history', OrderHistoryRoutes);
app.use('/api/rooms', RoomsRoutes);
app.use('/api/comments', CommentRoutes);
app.use('/api/messages', MessagesRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
