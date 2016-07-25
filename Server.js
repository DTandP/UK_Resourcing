var fs     = require('fs');
var express= require('express');
var app      = express();   
var watson = require('watson-developer-cloud');
var cors = require('cors');
//var csvjson = require('csvjson');
app.use(express.static('Job_field_Uk.csv'));

app.use(cors());

var bodyParser = require('body-parser');    
var methodOverride = require('method-override'); 

var clientId=null;
var conversationId=null;
var profile = {};
var dialog_id='11e0906a-6104-4af0-97ab-33e5df577e99'; 
var name_values={};
   
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

//dialog service initialisation at Global level

var dialog_service = watson.dialog({
  url: 'https://gateway.watsonplatform.net/dialog/api',
  username: '7e541725-bc70-4cf1-9704-c78a87ede6e9',
  password: 'KOTPlFzzjCIL',
  version: 'v1'
});


//NLC service initialisation at Global level


var natural_language_classifier = watson.natural_language_classifier({
  url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
  username: 'e8487e1b-37a8-4b0c-a43d-f5268df76451',
  password: 'tmbcyAkGI0jJ',
  version: 'v1'
});



/* Webservice No.1 --> Sets ClientId and Conversation ID for the session */


//Start of First Webservice
  app.get('/api/initialDialogData', function(req, res) {

  

var params = {
   dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99' 
};


dialog_service.conversation(params, function(err, conversation) {
  if (err)
    console.log(err)
  else
    {

  clientId=conversation.client_id;
  conversationId=conversation.conversation_id;
  console.log("");
  console.log("Client Id is : "+clientId);
  console.log("Conversation id is : "+conversationId);
  console.log("");
    }
});
    });



//End of First webservice 



/* Webservice No.2 --> Handles textInput(instead of buttons) requests for first question */

//Start of Second Webservice
app.get('/api/textInputExecutiveProfessionalData', function(req, res) {

var msgBlock=req.param('msg');
//var msgBlock=""
console.log("");
console.log("You chose "+msgBlock);
console.log("");
console.log("1. First chat Cyclic Process initiating...");
console.log("");
console.log("Api called /api/textInputExecutiveProfessionalData");

console.log("");

console.log("Client Id out is : "+clientId);
  console.log("Conversation id out  is : "+conversationId);



natural_language_classifier.classify({
  text: msgBlock,
  classifier_id: 'c115fax73-nlc-5424' },
 
  function(err, response) {
    if (err)
      console.log('error:', err);
    else{


//res.send(response);

/*profile["Class1"] = response.classes[0].class_name;
profile["Class1_Confidence"] = response.classes[0].confidence.toString();
*/


var params2 = {
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
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
console.log("");
    console.log("2. Done Updating the dialog profile");

    console.log("");

console.log("3. Getting dialog Profile now.");
console.log("");
//console.log("wait begins");
//keeping a delay
//setTimeout(delay, 3000);

    setTimeout(getDialogProfile,0);
 
  }

});
    }

});

//end of NLC's classify and dialog service's update function

function getDialogProfile(){
  //console.log("");


  //console.log("Wait ends");

var params3 = {
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  
};

//should be used if profile info is needed
dialog_service.getProfile(params3, function(err, response){
console.log("");
  console.log("4. Checking response from dialog profile now:-");
console.log(response);
console.log("");
doConverse();
});

}


function doConverse(){
console.log("");
console.log("5. Now conversing with dialog service after updating the dialog profile.");
var params4 = {
  conversation_id: conversationId.toString(),
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  input:msgBlock
};

// Start of Dialog service's conversation function. Now converse with dialog service using converse function

//setTimeout(function() { 


  dialog_service.conversation(params4, function(err, conversation) {
  if (err)
    console.log(err)
  else
    {
      console.log("");
      console.log("6. Below is the response we are getting from dialog service against your input "+msgBlock+"");
console.log(conversation);
       console.log("***********End of Response*******");
  res.send(conversation.response[0])

  }

});
  // }, 0);

}



// end of converse function
    });

//End of Second Webservice


/* Webservice No.3 --> Handles buttonInput(instead of text) requests for first question */

 
//Start of first Webservice
  app.get('/api/buttonExecutiveProfessionalData', function(req, res) {

var msgBlock=req.param('msg');
//var msgBlock=""
console.log("");
console.log("You chose "+msgBlock);
console.log("");
console.log("1. First chat Cyclic Process initiating...");
console.log("");
console.log("Api called /api/buttonExecutiveProfessionalData");
console.log("");

console.log("Client Id out is : "+clientId);
  console.log("Conversation id out  is : "+conversationId);



natural_language_classifier.classify({
  text: msgBlock,
  classifier_id: 'c115fax73-nlc-5424' },
 
  function(err, response) {
    if (err)
      console.log('error:', err);
    else{


//res.send(response);

/*profile["Class1"] = response.classes[0].class_name;
profile["Class1_Confidence"] = response.classes[0].confidence.toString();
*/


var params2 = {
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  name_values: [{
       name:'Class1',
       value:response.classes[0].class_name
     },
     {
       name:'Class1_Confidence',
       value:response.classes[0].confidence.toString()
     },
     {
       name:'requisition_type',
       value:msgBlock
     }]
};


dialog_service.updateProfile(params2, function(err, response){

  if (err)
  console.log(err)
  else

  {
console.log("");
    console.log("2. Done Updating the dialog profile");

    console.log("");

console.log("3. Getting dialog Profile now.");
console.log("");
//console.log("wait begins");
//keeping a delay
//setTimeout(delay, 3000);

    setTimeout(getDialogProfile,0);
 
  }

});
    }

});

//end of NLC's classify and dialog service's update function

function getDialogProfile(){
 // console.log("");

  //console.log("Wait ends");

var params3 = {
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  
};

//should be used if profile info is needed
dialog_service.getProfile(params3, function(err, response){
console.log("");
  console.log("4. Checking response from dialog profile now:-");
console.log(response);
console.log("");
doConverse();
});

}


function doConverse(){
console.log("");
console.log("5. Now conversing with dialog service after updating the dialog profile.");
var params4 = {
  conversation_id: conversationId.toString(),
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  input:msgBlock
};

// Start of Dialog service's conversation function. Now converse with dialog service using converse function

//setTimeout(function() { 


  dialog_service.conversation(params4, function(err, conversation) {
  if (err)
    console.log(err)
  else
    {
      console.log("");
      console.log("6. Below is the response we are getting from dialog service against your input "+msgBlock+"");
console.log(conversation);
       console.log("***********End of Response*******");
  res.send(conversation.response[0])

  }

});
  // }, 0);

}



// end of converse function
    });

  //End of Third Webservice
 



/* Webservice No.4 --> Handles final Question-->"When do you want the candidate to join?" */


  app.get('/api/handleDate', function(req, res) {


var finalDate=req.param('fdoj');

/*

As of now Its just sending the date to the UI. Write code for dealing date with IBM blumix services here(send the finalDate variable to dialog service or NLC or update profile with any variable here)

*/
console.log("Final Date of joining is--> "+finalDate);

 res.send("Final Date of joining is--> "+finalDate);

    });

//End of fourth Webservice




/* Webservice No.5 --> update job field with user entered value. For Question "Can you specify the Job title's second part(This Webservice will trigger when user copy paste the job field in the input box...)" */

//Start of fifth Webservice
app.get('/api/updateJobField', function(req, res) {


var msgBlock=req.param('msg');
//var msgBlock=""
console.log("");
//console.log("You chose "+msgBlock);
console.log("");
console.log("1. Second chat Cyclic Process initiating...");
console.log("");
console.log("Api called /api/updateJobField");
console.log("");

console.log("Client Id out is : "+clientId);
  console.log("Conversation id out  is : "+conversationId);



var params2 = {
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  name_values: [
     {
       name:'job_field',
       value:msgBlock
     }]
};

//Adding Job_field variable to dialog profile(check spelling with Archana/Sauveer) 
dialog_service.updateProfile(params2, function(err, response){

  if (err)
  console.log(err)
  else

  {
console.log("");
    console.log("2. Done Updating the dialog profile");

    console.log("");

console.log("3. Getting dialog Profile now.");
console.log("");
//console.log("wait begins");
//keeping a delay
//setTimeout(delay, 3000);

    setTimeout(getDialogProfile2,0);
 
  }

});
    

//end of NLC's classify and dialog service's update function

function getDialogProfile2(){
 // console.log("");

  //console.log("Wait ends");

var params3 = {
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  
};

//should be used if profile info is needed
dialog_service.getProfile(params3, function(err, response){
console.log("");
  console.log("4. Checking response from dialog profile now:-");
console.log(response);
console.log("");
doConverse2();
});

}


function doConverse2(){
console.log("");
console.log("5. Now conversing with dialog service after updating the dialog profile.");
var params4 = {
  conversation_id: conversationId.toString(),
  dialog_id: '11e0906a-6104-4af0-97ab-33e5df577e99',
  client_id: clientId.toString(),
  input:msgBlock
};

// Start of Dialog service's conversation function. Now converse with dialog service using converse function

//setTimeout(function() { 


  dialog_service.conversation(params4, function(err, conversation) {
  if (err)
    console.log(err)
  else
    {
      console.log("");
      console.log("6. Below is the response we are getting from dialog service against your input "+msgBlock+"");
console.log(conversation);
       console.log("***********End of Response*******");
  res.send(conversation.response[0]);

  }

});
  // }, 0);

}



});

//End of Fifth Webservice


//Application listening on port 6080

  app.listen(6789);
    console.log("UK HR BOT app listening on port 6789");