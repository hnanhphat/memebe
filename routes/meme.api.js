const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.helper").upload;
const photoHelper = require("../middleware/photo.helper");
const memeController = require("../controllers/meme.controller");

/**
 * @route GET api/memes
 * @description Get all memes
 * @access Public
 */

router.get("/", memeController.getMemes);

// /**
//  * @route GET api/memes/:id
//  * @description Get all memes
//  * @access Public
//  */

// router.get("/:id", function (req, res, next) {
//   // res.json({ status: "ok", data: "Get all memes" });
//   res.send({ status: "ok", data: req.params.id });
// });

// /**
//  * @route POST api/memes
//  * @description Post a body to server
//  * @access Public
//  */

//  router.post("/", function (req, res, next) {
//   const requestData = req.body;
//   res.send({ status: "ok", data: requestData });
// });

/**
 * @route POST api/memes
 * @description Upload an image to server
 * @access Public
 */

router.post(
  "/",
  upload.single("image"),
  photoHelper.resize,
  memeController.createMeme
);

/**
 * @route GET api/memes/images
 * @description Get list of original images
 * @access Public
 */

router.get("/images", memeController.getOriginalImages);

module.exports = router;
