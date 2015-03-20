var express = require('express'),
    tm = require('./routes/trademark');

var app = express();

app.get('/trademark/:serial', tm.findBySerial);
app.get('/trademark', tm.findAll);

app.listen(3000);
console.log('Listening on port 3000...');