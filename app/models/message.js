var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({

	chat: 				{type: Schema.Types.ObjectId, ref:'Chat'},
    message:            {type:String, required:true},
    sender:             { id: { type: String }, name:{ type: String }, imgURL:{ type: String }},
    created_at:         {type:Date, default:Date.now}

})


module.exports = mongoose.model('Message', MessageSchema)