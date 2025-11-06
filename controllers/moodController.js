const moodController = {
    getMood: async function(req, res) {
        res.render('mood');
    }
}

module.exports = moodController;