var MongoClient = require('mongodb').MongoClient;
var path = require('path'),
    db;

MongoClient.connect('mongodb://127.0.0.1:27017/trademarkDB', function(err, trademarkDB) {
	if(err) throw err;
	db = trademarkDB;
});

exports.index = function(req, res){
	db.collection('trademark', function(err, collection) {
        collection.findOne({ db_date: { $exists: true } }, function(err, item) {
			res.render('index', { date:item.db_date});
        });
    });
};

exports.info = function(req, res){
  res.sendFile('info.html',{ root: path.join(__dirname, '../.') });
};

exports.findBySerial = function(req, res) {
    var serial = parseInt(req.params.serial);
    db.collection('trademark', function(err, collection) {
        collection.findOne({'serial': serial}, function(err, item) {
            res.json(item);
			// db.close();
        });
    });
};

// exports.findByManager = function(req, res) {
//     var id = parseInt(req.params.id);
//     console.log('findByManager: ' + id);
//     db.collection('trademark', function(err, collection) {
//         collection.find({'managerId': id}).toArray(function(err, items) {
//             console.log(items);
//             res.json(items);
//         });
//     });
// };

exports.findAll = function(req, res) {
    var amount = parseInt(req.query.amount,10);
    var start = parseInt(req.query.start,10);
    db.collection('trademark', function(err, collection) {
        if (req.query.amount && req.query.start) {
            collection.find().toArray(function(err, items) { //TODO make sure we're getting trademarks
                res.json(items.slice(+start, start+amount));
                // db.close();
            });
        } else {
            res.status(400).send('Bad Request');
            // collection.find().toArray(function(err, items) {
            //     res.json(items);
            // });
        }
    });
};

exports.createPopup = function(req, res){
    var serial = parseInt(req.params.serial);
    db.collection('trademark', function(err, collection) {
        collection.findOne({'serial': serial}, function(err, item) {
            res.render('popup', { name: item.name, serial: item.serial, num_images:item.num_images, image:item.image, fee:item.fee});
            // res.json(item);
            // db.close();
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    console.log("Populating trademark database...");
    var trademarks = [
        {'serial': '86563949', 'fee': '225', 'name': 'NYrture', 'image': ['00000002.JPG', '00000003.JPG', '00000004.JPG', '00000003.JPG', '00000004.JPG', '00000003.JPG', '00000004.JPG'], 'num_images': 7},
        {'serial': '86563975', 'fee': '225', 'name': 'APSI', 'image': ['00000002.JPG'], 'num_images': 1},
        {'serial': '86563984', 'fee': '825', 'name': 'Smart-Cut', 'image': ['00000002.JPG'], 'num_images': 1},
        {'serial': '86563957', 'fee': '275', 'name': 'Inspiring Better Content', 'image': ['00000002.JPG'], 'num_images': 1},
        {'serial': '86563993', 'fee': '275', 'name': 'REIMAGINE TENNIS', 'image': ['00000002.JPG'], 'num_images': 1},
        {'serial': '86563935', 'fee': '225', 'name': 'KANNU', 'image': ['00000002.JPG'], 'num_images': 1}
        ];

    trademark.collection('trademark', function(err, collection) {
        collection.insert(trademarks, {safe:true}, function(err, result) {});
    });

};