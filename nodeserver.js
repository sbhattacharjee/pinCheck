
var http = require('http'),
	qs = require("querystring"),
    url = require("url"),
	express = require('express'),
	path = require("path");

var app = express();

app.get('/', function(req, res) {

	res.sendFile(path.join(__dirname + '/index.html'));
  //res.type('text/plain');
  //res.send('Pin Check!!!');


//  getParam(req,res, function(){});  

});

var messageId = null;


//Live Key - 3 in 24 hour - sk_live_OA8HcymbxLnoAgwEOHevq4UY
//var getprove = require('getprove')('sk_live_OA8HcymbxLnoAgwEOHevq4UY');

//Test key - sk_test_KYILB4CN35aUUFrkI2QNVHXp
var getprove = require('getprove')('sk_test_KYILB4CN35aUUFrkI2QNVHXp');

/** 
*	1 - URL http://localhost:3000/verifyPhone?tele=15104587920
*	2 - http://localhost:3000/verifyPin?pin=20123456&msgid=1231343443534
**/

app.get('/verifyPhone', function(req, res) {

	var url_parts = url.parse(req.url, true);
	
	var pathname = url_parts.pathname;
	console.log("URL pathname ==>", pathname);

	var query = url_parts.query;

 	var phone = query.tele;

	console.log("Query.tele ==>", phone);	

	// Create a new verification
	getprove.verify.create({ tel: phone }, function(err, verify) {
    
    	if (err) return res.send(400, err.response)	   

    	console.log('Create a new verification', verify);

    	messageId = verify.id;

    	res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*'}); 
//	    	res.write(messageId);
    	res.end(messageId);

    });

});


app.get('/verifyPin', function(req, res) {

	var url_parts = url.parse(req.url, true);
	
	var pathname = url_parts.pathname;
	console.log("URL pathname ==>", pathname);

	var query = url_parts.query;

	var pin = query.pin;
	var messageId = query.msgid;

	console.log("pin ==>", pin, " & messageId ==>", messageId);	

	getprove.verify.pin(messageId, pin, function(err, verify) {
   
	   	if (err) return res.send(400, err.response)	   
	   
	   	console.log('Verify a pin', verify);
	    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin' : '*' }); 
	//		    res.write("Pin confirmed");
	    res.end("Pin confirmed");

	});

});


app.listen(3000);

console.log("server listening on port 3000..!");