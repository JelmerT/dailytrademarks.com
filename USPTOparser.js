#!/usr/bin/env node

var program = require('commander');
var unzip	= require('unzip');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var xml2js = require('xml2js');

program
    .version('0.0.1')
    .usage('<archive path>')
    .parse(process.argv);

if(!program.args.length) {
    program.help();
} else {
    console.log('file: ' + program.args);

  	fs.createReadStream(path.resolve(program.args[0]))
  		.pipe(unzip.Parse())
  		.on('entry', function (entry) {
  		  var fileName = entry.path;
  		  var mimeType = mime.lookup(fileName);
  		  var type = entry.type; // 'Directory' or 'File'
  		  // var size = entry.size;
  		  if (mimeType =='application/xml') {
  		  	var parser = new xml2js.Parser();
  		  	console.log(fileName);
  		  	entry.pipe(fs.createWriteStream('./test.xml'));
  		  	entry.on('end', function () {
  		  		fs.readFile('./test.xml', function(err, data) {
			    	parser.parseString(data, function (err, result) {
			    	    // console.log(err);
			    	    result = (JSON.stringify(result)).replace(/-/g,'_');
			    	    try{
			    	    console.log(JSON.parse(result).uspto_tm_document.trademark_case_files[0].trademark_case_file[0].case_file_header[0].mark[0].design_mark[0].file_name[0]._);
			    	    console.log(1);
			    	    }
			    	    catch (e){
			    	    		console.log(e);
			    	    	try{
			    	    		console.log(JSON.parse(result).usptotmdocument.ENOTIF[0].BIRTH[0].IMAGE[0].$['NAME']);
			    				console.log(2);
			    			}
			    			catch (e){
			    				console.log(e);
			    			}
			    	    }
			    	    // console.log(result);

			    	});
				});
			});

  	// 	  	fs.readFile('test.xml', function(err, data) {
			//     parser.parseString(data, function (err, result) {
			//     	// console.log(result);
			//         // console.log(result);
			//         console.dir(result);
			//         // console.log('Done');
			//     });
			// });
  		  	entry.autodrain();
  		  } else {
  		    entry.autodrain();
  		  }
  		});
}