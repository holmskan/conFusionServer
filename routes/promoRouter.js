const express = require("express");
const bodyParser = require("body-parser");

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

promoRouter.get("/", (req, res) => {
  res.end("Will send all the promotions to you!");
});
promoRouter.post("/", (req, res) => {
  res.end(
    "Will add the promotion: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});
promoRouter.put("/", (req, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /promotions");
});
promoRouter.delete("/", (req, res) => {
  res.end("Deleting all the promotions!");
});

promoRouter.get("/:promoId", (req, res) => {
  res.end(
    "Will send details of the promotion: " + req.params.promoId + " to you!"
  );
});
promoRouter.post("/:promoId", function (req, res) {
  res.statusCode = 403;
  res.end("POST operation not supported on /promotions/" + req.params.promoId);
});
promoRouter.put("/:promoId", (req, res) => {
  res.write("Updating the promotions: " + req.params.promoId + "\n");
  res.end(
    "Will update the promotion: " +
      req.body.name +
      " with details: " +
      req.body.description
  );
});
promoRouter.delete("/:promoId", (req, res) => {
  res.end("Deleting promotion: " + req.params.promoId);
});

module.exports = promoRouter;
