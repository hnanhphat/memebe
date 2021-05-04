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

/**
 * @route GET api/memes/:id
 * @description Get single meme by id
 * @access Public
 */

router.get("/:id", memeController.singleMeme);

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

/**
 * @route PUT api/memes/:id
 * @description Update text on the meme
 * @access Public
 */

router.put("/:id", memeController.updateMeme);

/**
 * @route DELETE api/memes/:id
 * @description delete meme by id
 * @access Public
 */

router.delete("/:id", memeController.deleteMeme);

module.exports = router;
