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
  S2E02: "The Cave of Two Lovers",
  S2E03: "Return to Omashu",
  S2E04: "The Swamp",
  S2E05: "Avatar Day",
  S2E06: "The Blind Bandit",
  S2E07: "Zuko Alone",
  S2E08: "The Chase",
  S2E09: "Bitter Work",
  S2E10: "The Library",
  S2E11: "The Desert",
  S2E12: "The Secret of the Fire Nation",
  S2E13: "City of Walls and Secrets",
  S2E14: "Tales of Ba Sing Se",
  S2E15: "Appa's Lost Days",
  S2E16: "Lake Laogai",
  S2E17: "The Earth King",
  S2E18: "The Guru",
  S2E19: "The Crossroads of Destiny",
  S3E01: "The Awakening",
  S3E02: "The Headband",
  S3E03: "The Painted Lady",
  S3E04: "Sokka's Master",
  S3E05: "The Beach",
  S3E06: "The Avatar and the Firelord",
  S3E07: "The Runaway",
  S3E08: "The Puppetmaster",
  S3E09: "Nightmares and Daydreams",
  S3E10: "Day of Black Sun",
  S3E11: "The Western Air Temple",
  S3E12: "The Firebending Masters",
  S3E13: "The Boiling Rock",
  S3E14: "The Southern Raiders",
  S3E15: "The Ember Island Players",
  S3E16: "Sozin's Comet, Part 1: The Phoenix King",
  S3E17: "Sozin's Comet, Part 2: The Old Masters",
  S3E18: "Sozin's Comet, Part 3: Into the Inferno",
  S3E19: "Sozin's Comet, Part 4: Avatar Aang",

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
