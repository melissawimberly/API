// Main starting point of the application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");

// DB Setup
mongoose.connect("mongodb://localhost:auth/auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;

connection.on("connected", function () {
  console.log("connected to db");
});
// App Setup (setting up express)
app.use(morgan("combined"));
// morgan is a middleware logging framework that logs incoming requests to the terminal
app.use(bodyParser.json({ type: "*/*" }));
// body-parser is a middleware that parses incoming requests into json
router(app);

// Server Setup (express talking to outside world)
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on : ", port);
