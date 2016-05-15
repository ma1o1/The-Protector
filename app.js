//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
var url = require( "url" );
var clienti=["Jure","Alenka","Tom"];
var statusi=["false","Vse ok","Poskodovan"];
var podatki="hello ";
var test2= "";
var util = require('util');

//We need a function which handles requests and send response
function handleRequest(request, response){
   
	podatki+= " I ";
	if((request.url)=='/reset'){
		podatki="";
	}
	if((request.url).indexOf('/send/')>-1){
		var parts= (request.url).split("/");
		podatki=parts[parts.length-1];
		if(podatki.localeCompare("true")==0){
			statusi[0]="true";
		}
		else{
			statusi[0]="false";
		}
		response.end();
        
	
    }    

    if(request.url!='/'){
        console.log("Request handler random was called.");
        response.writeHead(200, {"Content-Type": "application/json"});
        var indeks = -1;
		for(var i = 0; i<clienti.length;i++){
			if((request.url).indexOf(clienti[i])==1){
				indeks = i;
				break;
			}
		}
		//hello
		if(indeks==-1){
			response.end('Nisem nasel ' + request.url);
		}
		else{
			var otherArray = { Ime: clienti[indeks], Status: statusi[indeks], Cas: "pred 9h"};
			  
			  var json = JSON.stringify({ 
				Oseba: otherArray, 
				
			  });
			  response.end(json);
		}
    }
	else{
		response.end("Listening on " + server_ip_address + ", server_port " + server_port +" " + podatki + test2);
	}
}

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});
