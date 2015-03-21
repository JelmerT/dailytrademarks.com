var express = require('express'),
    tm = require('./routes/trademark'),
    site = require('./routes/site');

var app = express();
app.enable('trust proxy');

app.get('/trademark/:serial', tm.findBySerial);
app.get('/trademark', tm.findAll);
app.get('/', site.index);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(3000);
console.log('Listening on port 3000...');