const Jimp = require("jimp");

const jimp = (path) => {
  Jimp.read(path, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(path); // save
  });
};

module.exports = jimp;
