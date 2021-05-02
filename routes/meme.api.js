const express = require("express");
const router = express.Router();

/**
 * @route GET api/memes
 * @description Get all memes
 * @access Public
 */

router.get("/", function (req, res, next) {
  // res.json({ status: "ok", data: "Get all memes" });
  res.send({ status: "ok", data: "Get all memes" });
});

/**
 * @route GET api/memes/:id
 * @description Get all memes
 * @access Public
 */

router.get("/:id", function (req, res, next) {
  // res.json({ status: "ok", data: "Get all memes" });
  res.send({ status: "ok", data: req.params.id });
});

/**
 * @route POST api/memes
 * @description Post a body to server
 * @access Public
 */

router.post("/", function (req, res, next) {
  const requestData = req.body;
  res.send({ status: "ok", data: requestData });
});

/**
 * @route POST api/memes/create
 * @description Upload an image to server
 * @access Public
 */

const upload = require("../middleware/upload.helper").upload;
const photoHelper = require("../middleware/photo.helper");
router.post(
  "/create",
  upload.single("image"),
  photoHelper.resize,
  (req, res, next) => {
    console.log(req.file);
    res.json({ status: "ok" });
  }
);

module.exports = router;
