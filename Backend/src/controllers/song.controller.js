const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.service");

async function uploadSong(req, res) {
  const songBuffer = req.file.buffer;

  const { mood } = req.body;
  const tags = id3.read(songBuffer);

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      fileName: tags.title + ".mp3",
      folder: "EmoSense/song",
    }),

    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      fileName: tags.title + ".jpeg",
      folder: "EmoSense/posters",
    }),
  ]);

  const song = await songModel.create({
    title: tags.title,
    url: songFile.url,
    posterUrl: posterFile.url,
    mood,
  });

  res.status(201).json({
    message: "Song created successfully",
    song,
  });
}

async function getSong(req, res) {
  const { mood } = req.query;

  const song = await songModel.find({ mood });

  res.status(200).json({
    message: "Song fetched successfully",
    song
  });
}

module.exports = { uploadSong, getSong };
