var evt = require('events');

function FileStream(){
    this._file = "";
    this._data = "[Empty]"
}
FileStream.prototype = new evt.EventEmitter();

FileStream.prototype.readDataFromFile = function(path, callback){
    this.file = path;
    if(typeof callback == 'function'){
        this.once('readData', callback)
    }
    this._read();
};

FileStream.prototype.writeDataToFile = function(path, data, callback){
    this.file = path; 
    if(typeof callback == 'function'){
        this.once('writeData', callback)
    }
    this._write(data);
};

FileStream.prototype._read = function(){
    console.log('\nReading...');
    this.emit('readData', this._data,);    
    console.log('Data was read.');
}
FileStream.prototype._write = function(data){
    console.log(`\nWriting "${data}" to file...`);
    this._data = data;
    this.emit('writeData', 'Data was written.');    
}

module.exports.FileStream = FileStream;



