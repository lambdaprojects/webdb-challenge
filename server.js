const express = require("express");
const projectRouter = require("./data/routers/projectRouter.js");
const actionRouter = require("./data/routers/actionRouter.js");
const contextRouter = require("./data/routers/contextRouter.js");
const actionContextRouter = require("./data/routers/actionContextRouter.js");

const server = express();
server.use(express.json());

// const cors = require("cors");
// server.use(cors());

server.get("/", (req, res) => {
  res.send(`<h2>Ready, set go! for Sprint Challenge</h2>`);
});

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);
server.use("/api/context", contextRouter);
server.use("/api/actionContext", actionContextRouter);

module.exports = server;
