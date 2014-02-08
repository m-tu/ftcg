
/*
 * GET home page.
 */

exports.index = function(req, res){

  scripts: [
    'js/canvas.js'
  ]

  res.render('index', { title: 'Get fucked', scripts: scripts });



};