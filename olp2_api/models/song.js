const mongoose = require('mongoose');

const lyricStanza = new mongoose.Schema({
    "type": String,
    "number": Number,
    "text": String
});

const chordStanza = new mongoose.Schema({
    "type": String,
    "value": String
});

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    composer: String,
    lyricist: String,
    key: String,
    lyrics: [lyricStanza],
    chords: [chordStanza]
});

mongoose.model('Song', songSchema);