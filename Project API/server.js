require('dotenv').config();
const express = require('express');
const connectDB = require('./Config/database.config')
const server = express();

const PORT = process.env.PORT || 3000;

connectDB();

server.use(express.json());
server.use('/', require('./Routes/index.routes'));

server.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
    console.log(`Server Running at http://localhost:${PORT}/`)
});