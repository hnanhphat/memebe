const fs = require("fs");
const photoHelper = require("../middleware/photo.helper");
const utilsHelper = require("../middleware/utils.helper");

const createMeme = async (req, res, next) => {
  try {
    // Read data from the json file
    let rawData = fs.readFileSync("meme.json");
    let memes = JSON.parse(rawData).memes;

    const meme = {};

    const texts = req.body.texts || [];
    const textsArr = [].concat(texts); // Make sure texts is an array.
    meme.texts = textsArr.map((text) => JSON.parse(text));

    // Prepare data for the new meme
    meme.id = Date.now();
    meme.originalImage = req.file.filename;
    meme.originalImagePath = req.file.path;
    const newFilename = `MEME_${meme.id}`;
    const newDirectory = req.file.destination;
    const newFilenameExtension = meme.originalImage.split(".").slice(-1);
    meme.outputMemePath = `${newDirectory}/${newFilename}.${newFilenameExtension}`;

    // Put text on image
    await photoHelper.putTextOnImage(
      meme.originalImagePath,
      meme.outputMemePath,
      meme.texts
    );

    // Add the new meme to the beginning of the list and save to the json file
    meme.createdAt = Date.now();
    meme.updatedAt = Date.now();
    memes.unshift(meme);
    fs.writeFileSync("meme.json", JSON.stringify({ memes }));
    res.status(201).json(meme);
  } catch (err) {
    next(err);
  }
};

const getMemes = (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    // Read data from the json file
    let rawData = fs.readFileSync("meme.json");
    let memes = JSON.parse(rawData).memes;

    // Calculate slicing
    const totalMemes = memes.length;
    const totalPages = Math.ceil(totalMemes / perPage);
    const offset = perPage * (page - 1);
    memes = memes.slice(offset, offset + perPage);

    res.json({ memes, totalPages });
  } catch (err) {
    next(err);
  }
};

const singleMeme = async (req, res, next) => {
  try {
    const memeId = parseInt(req.params.id);

    // Read data from the json file
    let rawData = fs.readFileSync("meme.json");
    let memes = JSON.parse(rawData).memes;
    const index = memes.findIndex((meme) => meme.id === memeId);

    if (index === -1) return next(new Error("Meme not found"));

    const meme = memes[index];
    res.json({ meme });
  } catch (err) {
    next(err);
  }
};

const getOriginalImages = (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;

    // Read data from the json file
    let rawData = fs.readFileSync("meme.json");
    let memes = JSON.parse(rawData).memes;
    let originalImages = memes.map((item) => item.originalImagePath);
    originalImages = originalImages.filter(
      (item, i, arr) => arr.indexOf(item) === i
    );

    // Calculate slicing
    const totalMemes = memes.length;
    const totalPages = Math.ceil(totalMemes / perPage);
    const offset = perPage * (page - 1);
    originalImages = originalImages.slice(offset, offset + perPage);

    res.json({ originalImages, totalPages });
  } catch (err) {
    next(err);
  }
};

const updateMeme = async (req, res, next) => {
  try {
    const memeId = parseInt(req.params.id);

    // Read data from the json file
    let rawData = fs.readFileSync("meme.json");
    let memes = JSON.parse(rawData).memes;
    const index = memes.findIndex((meme) => meme.id === memeId);

    if (index === -1) return next(new Error("Meme not found"));

    const meme = memes[index];
    let { texts } = req.body;
    meme.texts = texts && Array.isArray(texts) ? texts : [];
    meme.updatedAt = Date.now();

    // Put text on image
    await photoHelper.putTextOnImage(
      meme.originalImagePath,
      meme.outputMemePath,
      meme.texts
    );
    fs.writeFileSync("meme.json", JSON.stringify({ memes }));
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      meme,
      null,
      "Meme has been updated!"
    );
  } catch (err) {
    next(err);
  }
};

const deleteMeme = async (req, res, next) => {
  try {
    const memeId = parseInt(req.params.id);

    // Read data from the json file
    let rawData = fs.readFileSync("meme.json");
    let memes = JSON.parse(rawData).memes;
    const index = memes.findIndex((meme) => meme.id === memeId);

    if (index === -1) return next(new Error("Meme not found"));

    const meme = memes[index];
    try {
      fs.unlinkSync(meme.originalImagePath);
      fs.unlinkSync(meme.outputMemePath);
    } catch (err) {
      next(err);
    }

    memes.splice(index, 1);
    fs.writeFileSync("meme.json", JSON.stringify({ memes }));
    res.status(201).json(memes);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMeme,
  getMemes,
  singleMeme,
  getOriginalImages,
  updateMeme,
  deleteMeme,
};
