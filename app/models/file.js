var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var File = new Schema({

    project: 			{type: Schema.Types.ObjectId, ref:'Project'},
    title:              {type: String},
    path:           	{type: String}
})


module.exports = mongoose.model('File', File)