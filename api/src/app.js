const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
const jsonErrorHandler = require('./middlewares/errorHandler');
const {
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
    MessagesRoutes,
    SearchRoutes,
    RegionRoutes
} = require("./routes");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost',
    credentials: true,
}));
app.use(jsonErrorHandler);

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
app.use('/api/regions', RegionRoutes);
app.use('/api/search', SearchRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
