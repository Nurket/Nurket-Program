var express = require('express');
var router = express.Router();

router.get('/game', (req, res) => {
    res.render('game');
  });

  module.exports = router;