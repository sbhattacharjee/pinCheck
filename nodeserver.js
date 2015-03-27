
var http = require('http'),
	qs = require("querystring"),
    url = require("url");


//Live Key - 3 in 24 hour - sk_live_OA8HcymbxLnoAgwEOHevq4UY
//var getprove = require('getprove')('sk_live_OA8HcymbxLnoAgwEOHevq4UY');

//Test key - sk_test_KYILB4CN35aUUFrkI2QNVHXp
var getprove = require('getprove')('sk_test_KYILB4CN35aUUFrkI2QNVHXp');



function createVerification(err, verify) {
  if (err) throw err
	
	console.log('Create a new verification', verify)

  // SMS or call sent at this point (but not if we're using test api key)

  // Add something like `res.render()` here or tell the user we sent them a pin.
  // ...

  // Verify a pin (you'd use something like `req.body.pin`)
  var pin = "000000" // since we're in test mode it's always 000000
  getprove.verify.pin(verify.id, pin, function(err, verify) {
    if (err) throw err
    console.log('Verify a pin', verify)

    // Put something else like `next()` here if it was a middleware
    //process.exit(0)


  });
}



 // Verify a pin (you'd use something like `req.body.pin`)
function verifyPin(req,res,next){

	/*console.log("Query ==>", req.body);

	var qsObj = qs.parse(req.url.query);

    req.queryData = qsObj;
    if (req.method === "GET"){
    		
            var data = '';
            req.on("data",function(chunk){
            	console.log ("values from the url ==>",chunk);
                data += chunk;
                
            });
            req.on("end", function(){
                var qsObj = qs.parse(data);
                req.bodyData = qsObj;
                console.log (" Data values ==>", qsObj)

                next();
            });
        }
    else {
        next();
        console.log("In else...");
    }	

		getprove.verify.pin(req.body.proveToken, req.body.provePin, function(err, verify) {
	    if (err) return res.send(400, err.response)
	    // note: here's a good spot to store verify.id to db
	    res.send(200)


    */

	// Create a new verification
	getprove.verify.create({ tel: '15104587920' }, createVerification)




}


function getParam(req, res, next){
	
	var url_parts = url.parse(req.url, true);
	
	var pathname = url_parts.pathname;
	console.log("URL pathname ==>", pathname);

	var query = url_parts.query;

	if(pathname === "/verifyPhone"){
		
		var phone = query.tele;

		console.log("Query.tele ==>", phone);	

		// Create a new verification
		getprove.verify.create({ tel: phone }, function(err, verify) {
	    
	    	if (err) return res.send(400, err.response)	   

	    	console.log('Create a new verification', verify);

	    	res.send(200) 
	    );
	}
	else if (pathname === "/verifyPin"){		
		var pin = query.pin;

		console.log("Query.pin ==>", pin);	

		getprove.verify.pin(req.body.proveToken, req.body.provePin, function(err, verify) {
	   
	   	if (err) return res.send(400, err.response)
	   
	   	console.log('Verify a pin', verify);
	    res.send(200);

	}	
}


var server = http.createServer(function(req,res){
    console.log("a new request is made..");

	res.writeHead(200, {'Content-Type': 'text/plain'});
  	res.end('PinCheck Server\n');	

  	getParam(req,res, function(){});

    verifyPin(req,res, function(){});         
    
});
server.listen(3000);

console.log("server listening on port 3000..!");





