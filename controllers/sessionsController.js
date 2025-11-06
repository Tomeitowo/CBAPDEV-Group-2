const sessionsController = {
    getSessions: async function (req, res) {
        res.render('sessions');
    }
}

module.exports = sessionsController;