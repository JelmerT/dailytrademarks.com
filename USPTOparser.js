#!/usr/bin/env node

var program = require('commander');
var unzip	= require('unzip');
var fs = require('fs');

program
    .version('0.0.1')
    .usage('<archive path>')
    .parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
    console.log('file: ' + program.args);

  	fs.createReadStream(program.args)
  		.pipe(unzip.Parse())
  		.on('entry', function (entry) {
  		  var fileName = entry.path;
  		  var type = entry.type; // 'Directory' or 'File'
  		  var size = entry.size;
  		  if (fileName === "this IS the file I'm looking for") {
  		    entry.pipe(fs.createWriteStream('output/path'));
  		  } else {
  		    entry.autodrain();
  		  }
  		});
}