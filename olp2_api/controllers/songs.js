const mongoose = require('mongoose');
const Song = mongoose.model('Song');

const songRead = (req, res) => {
    Song.findById(req.params.songId).
        exec((err, song) => {
            if (!song) res.status(404).json({ "error": "song not found" });
            else if (err) res.status(500).json(err);
            else res.status(200).json(song);
        });
};

const songsList = (req, res) => {
//    console.log("In api server, search key", req.query.search);
    var titleKey = {};
    if (req.query.search) {
        titleKey = {
            title:
                { "$regex": new RegExp( req.query.search, 'i') }
        };
    }
    Song.find(titleKey).select('title').
        exec((err, songs) => {
            if (err) res.status(500).json(err);
            else res.status(200).json(songs);
        });
};

module.exports = {
    songRead,
    songsList
}


