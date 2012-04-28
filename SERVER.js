var async = require('async');
var express = require('express');
var util = require('util');
var gm = require('googlemaps'); //https://github.com/moshen/node-googlemaps/blob/master/lib/googlemaps.js
var _       = require('underscore')._;
var geohash = require("geohash").GeoHash;
//var http = require("http"); /
var request = require('request'); //To add!!

/*
var geohash = require("geohash").GeoHash;

var _       = require('underscore')._;
*/

///////////////////////////////////////////////////////////////////
//    Database
////////////////////////////////////////////////////////////////

// Main  DB
var databaseUrl = process.env.MONGOLAB_URI; //""; // "username:password@example.com/mydb"
//var databaseUrlTransit = process.env.MONGOHQ_URL; //""; // "username:password@example.com/mydb"
var collections = ["grid"];
var db = require("mongojs").connect(databaseUrl, collections);


db.grid.ensureIndex({ geohash: 1}, {unique:true}); //info: http://www.mongodb.org/display/DOCS/Indexes
//geo loc indexes
db.grid.ensureIndex({
    'loc': '2d'
});





///////////////////////////////////////////////////////////////////
//    Express server setup
////////////////////////////////////////////////////////////////
// create an express webserver
var app = express.createServer(
express.logger(), express.static(__dirname + '/public'), express.bodyParser(),
  //express.bodyDecoder(), //for stripe??
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({
      secret: process.env.SESSION_SECRET || 'topsecret515das23388849fajczio97456'
  }), require('faceplate').middleware({
     // app_id: process.env.FACEBOOK_APP_ID,
     // secret: process.env.FACEBOOK_SECRET,
      scope: 'user_likes,user_photos,user_photo_video_tags,email,user_work_history,location,friends,languages,user_website'
      //NOTE: SCOPE is set on CLIENT SIDE TOKEN!
}));


// app.use( require('express-subdomain-handler')({ baseUrl: 'weroll.net', prefix: 'city', logger: true }) ); 

app.debug = true; // a silly attempt to centralized that...
var port = process.env.PORT || 3000; // listen to the PORT given to us in the environment
app.listen(port, function () {
    console.log("Listening on " + port);
});

//var everyone = require("now").initialize(app); //has to be called AFTER we listen.

app.dynamicHelpers({
    'host': function (req, res) {
        return req.headers['host'];
    },
    'scheme': function (req, res) {
        req.headers['x-forwarded-proto'] || 'http'
    },
    'url': function (req, res) {
        return function (path) {
            return app.dynamicViewHelpers.scheme(req, res) + app.dynamicViewHelpers.url_no_scheme(path);
        }
    },
    'url_no_scheme': function (req, res) {
        return function (path) {
            return '://' + app.dynamicViewHelpers.host(req, res) + path;
        }
    },
});




function index(req, res){  //TODO: MAKE the delivery 100% static, no node processing.
 
  
  res.sendfile(__dirname + '/public/index.html' );  //+ req.url
  /*res.render('public/index.html', {
      layout: false,
      req: req,
      app: app
  });*/
}


function getCityByIp(req, res, ip, cb){
  var ip = req.connection.remoteAddress;
  //request('http://ipdata.heroku.com/location.json?ip='+ip, function (error, response, body) {
                                    // /location.json?ip=134.226.83.50
  console.log(ip)
  if(ip == '127.0.0.1') ip= '134.226.83.50';
   var url = 'http://ipdata.heroku.com/location.json?ip='+ip; // don't fuck with my own geo ip app please
  request(url, function (error, response, body) {
    console.log(url);
    console.log(body);
    if (!error && body) {//response.statusCode == 200
      cb(body);
    }else{
      console.log("ERR: Cant reach the GEOIP app web-service" );
      console.log( error);
      cb(null);
    }
  });
}  
  

app.get('/api/geoip', function (req, res) { //test method...
  getCityByIp(req, res, req.connection.remoteAddress, function(data){ 
    console.log(data);
    res.send(data)
    // TODO check in the DB, if this city is already flagged.
  });
})



///////////////////////////////////////////////////////////////////
//    main route
////////////////////////////////////////////////////////////////


app.get('/', index);
app.get('/location', index);



app.get('/api/city', function (req, res) { // return ALL cities objects...
  db.grid.find({ precision: "6" }, function(err, cities) {
    if( err || !cities){console.log("No cities of this precision found...");}
    else{ 
      cities.forEach( function(city) {
        console.log(city);
      });
      res.send(cities)
    }
  });
});



app.get('/echo', function (req, res) {
    echo = req.param("echo", "no param")
    res.send('ECHO: ' + echo);
});





/*   
///////////////////////////////////////////////////////////////////
//    USER SET LOCATION Location API V1
////////////////////////////////////////////////////////////////
//   /api/setlocation/?home=laval&work=montreal
app.get('/api/setlocation', function (req, res) { // fetch data on facebook for our user, saves it to the database.
    // TODO: ENsure user is logged!
  ensureSession(req, res, function(){
    async.parallel([ // call google-maps for both addresses async
    function (cb) {
        gm.geocode(req.param("home") || 'laval', function (err, data) {//return the geometry of the top matching location...
            req.home = data.results[0];
            req.home['geohash'] = geohash.encodeGeoHash(req.home.geometry.location.lng, req.home.geometry.location.lat); 
            req.home['loc'] = [req.home.geometry.location.lng, req.home.geometry.location.lat]; //for geospatial indexing
            
            cb();
        });
    }, function (cb) {
        gm.geocode(req.param("work") || 'Montreal', function (err, data) {
            req.work = data.results[0];
            req.work['geohash'] = geohash.encodeGeoHash(req.work.geometry.location.lng, req.work.geometry.location.lat);
            req.work['loc'] = [req.work.geometry.location.lng, req.work.geometry.location.lat]; //for geospatial indexing
            cb();
        });
    }, function (cb) {
        gm.distance(req.param("home") || 'montreal', req.param("work") || 'toronto', function (err, data) {
            req.commute = data.rows[0].elements[0]; //only keep distance + duration.
            cb();
        });
    }], function () { //Once we received all data from FB...
        var loc = {
            home: req.home,
            work: req.work,
            commute: req.commute,
            updated: new Date()
        }
        console.log('work');
        console.log(req.work);
        loc['commute']['distance_aprox'] = geoDistance(req.home['loc'], req.work['loc'], 'medium');
        loc['commute']['mid'] = {loc:  geoMidpoint( req.home['loc'], req.work['loc'], 'fast' )}; // return a loc object (lng, lat array)
        
        var uid = req.session.uid;
        db.users.update({id: uid}, { $set: { loc: loc }}, function (err, updated) {
            if (err || !updated) console.log("User not updated: " + req.session.uid);
            else console.log("User updated");
        });
        res.send(loc);
    }); //eo parrallel calls
  });//eo ensure-session
});


*/

///////////////////////////////////////////////////////////////////
//    Geo Location API V1
////////////////////////////////////////////////////////////////
app.get('/geohash/:id', function (req, res) {
    var latlon = geohash.decodeGeoHash(req.params['id']);
    lat = latlon.latitude[2];
    lon = latlon.longitude[2];
    zoom = req.params["id"].length + 2;
    res.render('geohash.ejs', {
        layout: false,
        lat: lat,
        lon: lon,
        zoom: zoom,
        geohash: req.params['id']
    });
});

app.get('/reverseGeo/:lat/:long', function (req, res) {
    gm.reverseGeocode('41.850033,-87.6500523', function (err, data) {
        util.puts(JSON.stringify(data));
        res.send(data);
    });
});

app.get('/getCoord/:address', function (req, res) {
    // var address = '520 rue fortune, montreal';
    var address = req.param("address", "montreal")
    gm.geocode(address, function (err, data) {
        util.puts(JSON.stringify(data));
        var coords = data.results[0].geometry.location; //return the geometry of the top matching location...
        res.send(coords);
    });
});



function getElevation(lat, lng, callback) {
    var options = {
        host: 'maps.googleapis.com',
        port: 80,
        path: '/maps/api/elevation/json?locations=' + lat + ',' + lng + '&sensor=true'
    };
    http.get(options, function (res) {
        data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function (chunk) {
            el_response = JSON.parse(data);
            callback(el_response.results[0].elevation);
        });
    });
};


///////////////////////////////////////////////////////////////////
//    DB EXAMPLES
////////////////////////////////////////////////////////////////
// examples....  (http://howtonode.org/node-js-and-mongodb-getting-started-with-mongojs)
/*
db.users.find({sex: "female"}, function(err, users) {
  if( err || !users) console.log("No female users found");
  else users.forEach( function(femaleUser) {
    console.log(femaleUser);
  } );
});

db.users.save({email: "srirangan@gmail.com", password: "iLoveMongo", sex: "male"}, function(err, saved) {
  if( err || !saved ) console.log("User not saved");
  else console.log("User saved");
});

db.users.update({email: "srirangan@gmail.com"}, {$set: {password: "iReallyLoveMongo"}}, function(err, updated) {
  if( err || !updated ) console.log("User not updated");
  else console.log("User updated");
});
*/




//})