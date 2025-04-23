var express = require('express');
var router = express.Router();

router.get('/characterCreation', (req, res) => {
    res.render('characterCreation');
  });

  module.exports = router;