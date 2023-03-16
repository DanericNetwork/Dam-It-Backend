const app = require('express')();
const http = require('http').createServer(app);

app.get('/', (req, res) => {
    res.send('<h1>Hey Socket.io</h1>');
});

http.listen(3000, () => {
    console.log('listening on http://localhost:3000');
});