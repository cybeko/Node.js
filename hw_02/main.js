var fileReader = require('./fileStream.js');
var reader = new fileReader.FileStream();

reader.readDataFromFile('file.js', function(responce){
    console.log(responce);
});

reader.writeDataToFile('file.js', "New content" ,function(responce){
    console.log(responce);
});

reader.readDataFromFile('file.js', function(responce){
    console.log(responce);
});

reader.writeDataToFile('file.js',"New content #2" ,function(responce){
    console.log(responce);
});

reader.readDataFromFile('file.js', function(responce){
    console.log(responce);
});


