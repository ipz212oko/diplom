const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const io = new Server({
    cors: {
        origin: "*",
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('send_message', (data) => {
        console.log(data);
        io.to(data.roomId).emit('receive_message', {
            message: data.message,
            sender: socket.id,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.SOCKET_PORT || 3001;
io.listen(PORT);
console.log(`Socket.IO server running on port ${PORT}`);
