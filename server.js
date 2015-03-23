var express = require('express'),
    site = require('./routes/site');

var app = express();
app.enable('trust proxy');

app.set('views', './views')
app.set('view engine', 'jade')

app.get('/', site.index);
app.get('/info', site.info);
app.get('/trademark', site.findAll);
app.get('/trademark/:serial', site.findBySerial);
app.get('/trademark/popup/:serial', site.createPopup);


app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.listen(3000);
console.log('Listening on port 3000...');