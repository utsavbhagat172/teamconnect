var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var TempUserSchema = new Schema({

	name: 				{ type: String, required:true },
	email: 				{ type: String, required:true, lowercase: true , index : { unique: true } },
	password : 			{ type: String, required:true , select:true },
	mobile: 			{ type: Number },
	imgURL: 			{ type:String },	
	projects:      		[ { type: Schema.Types.ObjectId, ref:'Project' } ],
	chats:      		[ { type: Schema.Types.ObjectId, ref:'Chat' } ],
	tag: 				{ type:String },
	accountStatus:  	{ type: String, default:'unverified' },
	OTPvalue: 			{ type: String },
	GENERATED_VERIFYING_URL:  String 


});

module.exports = mongoose.model('TempUser', TempUserSchema);