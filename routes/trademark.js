var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("trademarkDB");
    db.collection('trademark', {strict:true}, function(err, collection) {
        if (err) {
            console.log("The 'trademark' collection doesn't exist. Creating it with sample data...");
            populateDB();
        }
    });
});


exports.findBySerial = function(req, res) {
    console.log(req.params);
    var serial = parseInt(req.params.serial);
    console.log('findBySerial: ' + serial);
    db.collection('trademark', function(err, collection) {
        collection.findOne({'serial': serial}, function(err, item) {
            console.log(item, err);
            res.jsonp(item);
        });
    });
};

// exports.findByManager = function(req, res) {
//     var id = parseInt(req.params.id);
//     console.log('findByManager: ' + id);
//     db.collection('trademark', function(err, collection) {
//         collection.find({'managerId': id}).toArray(function(err, items) {
//             console.log(items);
//             res.jsonp(items);
//         });
//     });
// };

exports.findAll = function(req, res) {
    var amount = req.query["amount"];
    var start = req.query["start"];
    db.collection('trademark', function(err, collection) {
        if (amount) {
            // collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
            //     res.jsonp(items);
            // });
            console.log('Still need to implement amount var');
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
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

    db.collection('trademark', function(err, collection) {
        collection.insert(trademarks, {safe:true}, function(err, result) {});
    });

};