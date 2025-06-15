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
  // ... Add the rest as needed
};

const screenshotDir = path.join(__dirname, '..', '..', 'screenshots');

const uploadImages = async () => {
  await connectDB(); // ✅ call your existing DB connect function

  const files = fs.readdirSync(screenshotDir);

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const filePath = path.join(screenshotDir, file);

    const [episodePart, idDiffPart] = file.split('_');
    const img_id = parseInt(idDiffPart.slice(0, 2));
    const difficulty = idDiffPart[2].toUpperCase();

    const answer = episodePart;
    const title = episodeTitleMap[answer] || 'Unknown Episode';

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
