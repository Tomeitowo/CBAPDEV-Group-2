const goalsController = {
    getGoals: async function(req, res) {
        res.render('goals');
    }
};

module.exports = goalsController;