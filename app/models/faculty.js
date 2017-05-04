var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var FacultySchema = new Schema({

	name: 					{ type: String, required:true },
	department: 			{ type:String },
	designation: 			{ type:String },
	email: 					{ type: String, required:true, lowercase: true , index : 	{ unique: true } },
	password : 				{ type: String, required:true , select:true },
	mobile: 				{ type: Number },
	imgURL: 				{ type:String },	
	tag: 					{ type:String },
	accountStatus:  		{ type: String, default:'disbaled'},
	projects:      			[ { type: Schema.Types.ObjectId, ref:'Project' } ],
	chats:      			[ { type: Schema.Types.ObjectId, ref:'Chat' } ],
	invites: 	     		[ { type: Schema.Types.ObjectId, ref:'Invite' } ]



});


//password hashing
FacultySchema.pre('save', function(next){

	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){

		if(err) return(err);

		user.password = hash;
		next();
	});
});


//method to compare password
FacultySchema.methods.comparePassword = function(password){
	
	var user = this;
	
	return bcrypt.compareSync(password, user.password);
}



module.exports = mongoose.model('Faculty', FacultySchema);