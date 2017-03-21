// Main starting point of the appication
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require("mongoose");
const cors = require('cors');

// DB Setup
mongoose.connect('mongodb://azhuk:testpass123@ds127988.mlab.com:27988/redux_client');

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3060;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
