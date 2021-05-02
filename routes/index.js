const express = require("express");
const router = express.Router();

// Default api
router.get("/", function (req, res, next) {
  res.send({ status: "ok", data: "Home Page" });
});

// All route of Meme
const memeAPI = require("./meme.api");
router.use("/memes", memeAPI);

module.exports = router;
