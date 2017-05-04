var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');


var AdminSchema = new Schema({

	name: 				{ type: String, required:true },
	username: 			{ type: String, required:true , index : { unique: true } },
	email: 				{ type: String, required:true, lowercase: true , index : { unique: true } },
	password : 			{ type: String, required:true , select:true },
	mobile: 			{ type: Number },
	imgURL: 			{type:String},	
	tag: 				{type:String },
	accountStatus:  	{type: String, default:'1'}

});


//password hashing
AdminSchema.pre('save', function(next){

	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){

		if(err) return(err);

		user.password = hash;
		next();
	});
});


//method to compare password
AdminSchema.methods.comparePassword = function(password){
	
	var user = this;
	
	return bcrypt.compareSync(password, user.password);
}



module.exports = mongoose.model('Admin', AdminSchema);