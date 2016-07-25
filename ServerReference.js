var fs     = require('fs');
var express= require('express');
var app      = express();   
var watson = require('watson-developer-cloud');
var cors = require('cors');

app.use(cors());

var bodyParser = require('body-parser');    
var methodOverride = require('method-override'); 

var clientId=null;
var conversationId=null;
var profile = {};
var dialog_id='882c2893-9ac9-451d-a6f7-4a082e5ea512'; 
var name_values={};
   
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//dialog service initialisation

var dialog_service = watson.dialog({
  url: 'https://gateway.watsonplatform.net/dialog/api',
  username: '7e541725-bc70-4cf1-9704-c78a87ede6e9',
  password: 'KOTPlFzzjCIL',
  version: 'v1'
});

//NLC service initialisation


var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: 'e8487e1b-37a8-4b0c-a43d-f5268df76451',
  password: 'tmbcyAkGI0jJ',
  version: 'v1'
});

//Vinshu Api to begin conversation

  app.get('/api/initialDialogData', function(req, res) {

  

var params = {
   dialog_id: '882c2893-9ac9-451d-a6f7-4a082e5ea512' 
};


dialog_service.conversation(params, function(err, conversation) {
  if (err)
    console.log(err)
  else
  	{

 	clientId=conversation.client_id;
 	conversationId=conversation.conversation_id;
	console.log("Client Id is : "+clientId);
	console.log("Conversation id is : "+conversationId);
	}
});
    });

//Api to get response from NLC

  app.get('/api/initialNlcData', function(req, res) {

var msgBlock=req.param('msg');
console.log(msgBlock);
console.log("Client Id out is : "+clientId);
	console.log("Conversation id out  is : "+conversationId);



natural_language_classifier.classify({
  text: msgBlock,
  classifier_id: 'c115fax73-nlc-2239' },
 
  function(err, response) {
    if (err)
      console.log('error:', err);
    else{


profile["Class1"] = response.classes[0].class_name;
profile["Class1_Confidence"] = response.classes[0].confidence.toString();



var params2 = {
  dialog_id: '882c2893-9ac9-451d-a6f7-4a082e5ea512',
  client_id: clientId.toString(),
  name_values: [{
       name:'Class1',
       value:response.classes[0].class_name
     },
     {
       name:'Class1_Confidence',
       value:response.classes[0].confidence.toString()
     }]
};


dialog_service.updateProfile(params2, function(err, response){

	if (err)
	console.log(err)
	else

  {

    console.log("Done Updating");
    getDialogProfile();
 
  }

});
    }

});

//end of NLC's classify and dialog service's update function

function getDialogProfile(){
var params3 = {
  dialog_id: '882c2893-9ac9-451d-a6f7-4a082e5ea512',
  client_id: clientId.toString(),
  
};

//should be used if profile info is needed
dialog_service.getProfile(params3, function(err, response){
console.log(response);
doConverse();
});

}


function doConverse(){

var params4 = {
  conversation_id: conversationId.toString(),
  dialog_id: '882c2893-9ac9-451d-a6f7-4a082e5ea512',
  client_id: clientId.toString(),
  input:msgBlock
};

// Start of Dialog service's conversation function. Now converse with dialog service using converse function

setTimeout(function() { dialog_service.conversation(params4, function(err, conversation) {
  if (err)
    console.log(err)
  else
  	{
  		console.log("now conversing");
 	res.send(conversation.response[0])

 	}

});
	 }, 0);

}

// end of converse function
    });
 
//Application listening on port 6080

  app.listen(6080);
    console.log("UK HR BOT app listening on port 6080");