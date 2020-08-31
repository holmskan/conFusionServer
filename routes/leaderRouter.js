const express = require("express");
const bodyParser = require("body-parser");

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

leaderRouter.get("/", (req, res) => {
  res.end("Will send all the leaders to you!");
});
leaderRouter.post("/", (req, res) => {
  res.end(
    "Will add the leader: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});
leaderRouter.put("/", (req, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /leaders");
});
leaderRouter.delete("/", (req, res) => {
  res.end("Deleting all the leaders!");
});

leaderRouter.get("/:leaderId", (req, res) => {
  res.end(
    "Will send details of the leader: " + req.params.leaderId + " to you!"
  );
});
leaderRouter.post("/:leaderId", (req, res) => {
  res.statusCode = 403;
  res.end("POST operation not supported on /leaders/" + req.params.leaderId);
});
leaderRouter.put("/:leaderId", (req, res) => {
  res.write("Updating the leader: " + req.params.leaderId + "\n");
  res.end(
    "Will update the leader: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});
leaderRouter.delete("/:leaderId", (req, res) => {
  res.end("Deleting leader: " + req.params.leaderId);
});

module.exports = leaderRouter;
