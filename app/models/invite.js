var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InviteSchema = new Schema({

	email: 				{type:String},
    project:            {type: Schema.Types.ObjectId, ref:'Project'},
    chat: 				{type: Schema.Types.ObjectId, ref:'Chat'},
	role: 				{type:String},
	status: 			{type: String, default: 'invited'},
    created_at:         {type:Date, default:Date.now},
    created_by: 		{tyep: String}

})


module.exports = mongoose.model('Invite', InviteSchema)