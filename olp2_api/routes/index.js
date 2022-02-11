const express = require('express');
const router = express.Router();
const ctrlSongs = require('../controllers/songs');

router.route('/song/:songId')
    .get(ctrlSongs.songRead);

router.route('/songs')
    .get(ctrlSongs.songsList);

module.exports = router;