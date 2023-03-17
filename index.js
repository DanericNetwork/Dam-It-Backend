const app = require('express')();
const http = require('http').createServer(app);
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'myRandomHash';

const io = require('socket.io')(http, {
    cors: {
        origins: ['http://localhost:8080']
    }
});

io.use(async (socket, next) => {
    // Fetch the token from the frond-end
    const token = socket.handshake.auth.token;
    try {
        const user = await jwt.verify(token, JWT_SECRET);
        console.log('user', user);
        socket.user = user;
        next();
    } catch (e) {
        console.log('error', e.message);
        return next(new Error(e.message));
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
    let token = socket.handshake.auth.token;
    console.log('a user connected ' + token);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('my message', (msg) => {
        io.emit('my broadcast', `server: ${msg}`);
    });

    socket.on('join', (roomName) => {
        console.log("join: " + roomName);
        socket.join(roomName);
    })

    socket.on("message", ({ message, roomName }) => {
        console.log("message" + message + " in " + roomName);
        socket.to(roomName).emit("message", message);
        callbackify({
            status: "ok"
        });
    });
});

http.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});