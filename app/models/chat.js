var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatSchema = new Schema({

	name: 				{type:String},
	project: 			{type: Schema.Types.ObjectId, ref: 'Project'},
    users:              [{type: Schema.Types.ObjectId, ref:'User'}],
    faculties:       	[{type: Schema.Types.ObjectId, ref:'Faculty'}],
    messages:           [{type: Schema.Types.ObjectId, ref:'Message'}],
    created_at:         {type:Date, default:Date.now}

})


module.exports = mongoose.model('Chat', ChatSchema)