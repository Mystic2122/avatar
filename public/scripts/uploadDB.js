const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const connectDB = require('../../routes/db'); 
const Image = require('../../schema/Image'); // your imgSchema

cloudinary.config({
  cloud_name: process.env.IMG_NAME,
  api_key: process.env.IMG_PUBLIC,
  api_secret: process.env.IMG_SECRET
});

const episodeTitleMap = {
  S1E01: "The Boy in the Iceberg",
  S1E02: "The Avatar Returns",
  S1E03: "The Southern Air Temple",
  S1E04: "The Warriors of Kyoshi",
  S1E05: "The King of Omashu",
  S1E06: "Imprisoned",
  S1E07: "Winter Solstice Part 1: The Spirit World",
  S1E08: "Winter Solstice Part 2: Avatar Roku",
  S1E09: "The Waterbending Scroll",
  S1E10: "Jet",
  S1E11: "The Great Divide",
  S1E12: "The Storm",
  S1E13: "The Blue Spirit",
  S1E14: "The Fortuneteller",
  S1E15: "Bato of the Water Tribe",
  S1E16: "The Deserter",
  S1E17: "The Northern Air Temple",
  S1E18: "The Waterbending Master",
  S1E19: "The Siege of the North: Part 1",
  S1E20: "The Siege of the North: Part 2",
  S2E01: "The Avatar State",
  S2E02: "The Cave of Two Lovers"
};
const diffMap = { E: 'easy', M: 'medium', H: 'hard' };
const screenshotDir = path.join(__dirname, '..', '..', 'screenshots');

const uploadImages = async () => {
  await connectDB(); // ✅ call your existing DB connect function

  const files = fs.readdirSync(screenshotDir);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const filePath = path.join(screenshotDir, file);

    const baseName = path.basename(file, path.extname(file)); // "S1E01_01H"
    const [episodePart, idDiffPart] = baseName.split('_');
    const img_id = parseInt(idDiffPart.slice(0, 2));
    const difficulty = diffMap[idDiffPart[2].toUpperCase()];

    const answer = episodePart;
    const title = episodeTitleMap[answer] || 'Unknown Episode';
    const season = episodePart[1]
    const exists = await Image.findOne({ img_id, answer });
    if (exists) {
        console.log(`⏩ Skipping ${file} (already exists in DB)`);
        continue;
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'avatar-game'
      });

      const newImage = new Image({
        img_id,
        url: result.secure_url,
        answer,
        title,
        season,
        difficulty
      });

      await newImage.save();
      console.log(`✅ Uploaded and saved ${file}`);
    } catch (err) {
      console.error(`❌ Error with ${file}: ${err.message}`);
    }
  }

  mongoose.connection.close(); // ✅ good practice to close it after the job
};

uploadImages();
