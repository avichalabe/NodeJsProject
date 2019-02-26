// initialization variables
var express=require('express');
var fileData = require("fs")
var jsonData=require('./persons.json');
var parser = require("body-parser");
var jsonFile = "./persons.json"
var app=express();

app.use(parser.urlencoded({extended:true}));
app.use(parser.json());
app.use(express.static("./web"));

// read json to file
function getData(){
    var file = fileData.readFileSync(jsonFile, "utf-8");
    var jsonDB = JSON.parse(file);
    return jsonDB;
}

// add user to file
function addPersonToData(person){
    var jsonDB = getData();
    jsonDB.persons.push(person);
    fileData.writeFileSync(jsonFile, JSON.stringify(jsonDB));
}

// if user exist
function isPersonExist(personToAdd){
    var isExist = false;
    var jsonDB = getData();
    for(var person of jsonDB.persons){
        if(person.name.toLowerCase() == personToAdd.name.toLowerCase())
            isExist = true;
    }
    return isExist;
}

// post to web
app.post("/api/addPerson", function(request, response) {
    var person =request.body;
    if(isPersonExist(person)){
        response.status(400);
    }else{
        response.status(201);
        addPersonToData(person);        
    }  
    response.send();           
});
// get from web
app.get('/api/persons',(req,res)=>{
    res.status(200);
    var jsonDB = getData();
    res.send(JSON.stringify(jsonDB));
});

// run the server
app.listen(process.env.PORT||3000);