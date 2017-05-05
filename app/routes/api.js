process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Chat = require('../models/chat');
var Message = require('../models/message');
var TempUser = require('../models/tempuser');
var User = require('../models/user');
var Faculty = require('../models/faculty');
var Invite = require('../models/invite');
var Admin = require('../models/admin');
var Appointment = require('../models/appointment');
var Project = require('../models/project');
var random = require("random-js")(); // uses the nativeMath engine
var msg91=require('msg91-sms');
var File = require('../models/file');

var config = require('../../config/config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');
var mongoose = require('mongoose');

var nodemailer = require('nodemailer');

var nev = require('email-verification')(mongoose);

var async =  require('async');

var crypto = require('crypto');

var transporter = nodemailer.createTransport("SMTP",{
	service: "Gmail",
	auth: {
		user: "lnm.teamconnect@gmail.com",
		pass: "teamconnectlnm"
	}
});

var fs = require('fs');

var S3FS = require('s3fs');
var uuid = require('uuid');


var s3fsImpI = new S3FS('lnmteamconnect-1',{

	accessKeyId : 'AKIAIIGUOS7GYYZ4UFUQ',
	secretAccessKey: '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'
});

s3fsImpI.create();

var multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty();

// CREATE USER TOKEN
function createUserToken(user){

	var token = jsonwebtoken.sign({

		id:   user._id,
		name:   user.name,
		email:  user.email,
		mobile: user.mobile,
		tag:  "user"

	}, secretKey, {
		expiresIn: 900000000
	});

	return token
}

function createUserNewToken(user_id,name,email,age,gender,mobile){
	var token = jsonwebtoken.sign({

		id:   user_id,
		name:   name,
		email:  email,
		mobile: mobile,
		tag:  "user"

	}, secretKey, {
		expiresIn: 900000000
	});

	return token
}	


//CREATE Faculty TOKEN
function createFacultyToken(faculty){

	var token = jsonwebtoken.sign({

		id:   faculty._id,
		name:   faculty.name,
		email:  faculty.email,
		mobile: faculty.mobile,
		tag:  "faculty"

	}, secretKey, {
		expiresIn: 900000000
	});

	return token
}



//CREATE ADMIN TOKEN
function createAdminToken(admin){

	var token = jsonwebtoken.sign({

		id:   admin._id,
		name:   admin.name,
		username: admin.username,
		email:  admin.email,
		mobile: admin.mobile,
		tag:  "admin"

	}, secretKey, {
		expiresIn: 900000000
	});

	return token
}

function ifUser(tag){
	if(tag=="user"){
		return true;
	}
	return false;
}
function ifAdmin(tag){
	if(tag=="admin"){
		return true;
	}
	return false;
}

function ifFaculty(tag){
	if(tag=="faculty"){
		return true;
	}
	return false;
}

// email verification
// email verification
var options = {
	verificationURL: 'localhost:3000/api/email-verification/${URL}',

    // mongo-stuff
    persistentUserModel: 'User',
    tempUserModel: 'TempUser',
    tempUserCollection: 'tempusers',
    emailFieldName: 'email',
    passwordFieldName: 'password',
    URLFieldName: 'GENERATED_VERIFYING_URL',
    expirationTime: 86400,

    // emailing options
    transportOptions: {
    	service: 'Gmail',
    	auth: {
    		user: 'lnm.teamconnect@gmail.com',
    		pass: 'teamconnectlnm'
    	}
    },
    verifyMailOptions: {
    	from: 'Do Not Reply <lnm.teamconnect@gmail.com>',
    	subject: 'Confirm your account',
    	html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
    	'paste the following link into your browser:</p><p>${URL}</p>',
    	text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
    },
    sendConfirmationEmail: true,
    confirmMailOptions: {
    	from: 'Do Not Reply <lnm.teamconnect@gmail.com>',
    	subject: 'Successfully verified!',
    	html: '<p>Your account has been successfully verified.</p>',
    	text: 'Your account has been successfully verified.'
    },

    hashingFunction: null,
}


// NEV configuration =====================
nev.configure({
	persistentUserModel: User,
  expirationTime: 600, // 10 minutes

  verificationURL: 'localhost:8080/api/email-verification/${URL}',
  transportOptions: {
  	service: 'Gmail',
  	auth: {
  		user: 'lnm.teamconnect@gmail.com',
  		pass: 'teamconnectlnm'
  	}
  },

  //hashingFunction: myHasher,
  passwordFieldName: 'password',
}, function(err, options) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
	if (err) {
		console.log(err);
		return;
	}

	console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});





module.exports = function(app, express, io){

	var api = express.Router();
	api.use(multipartyMiddleware);


	api.post('/file-upload',function(req, res, buf){

	var file = req.files.file;
	var pid = '590b6c9b2f14fb70067afdd1';
	console.log(file,'=========================================', pid)
     // multiparty is what allows the file to to be accessed in the req
     var stream = fs.createReadStream(file.path);
     var extension = file.path.substring(file.path.lastIndexOf('.'));
     var destPath = '/' + uuid.v4() + extension;

     var base = 'https://console.aws.amazon.com/s3/buckets/lnmteamconnect-1';
     s3fsImpI.writeFile(destPath, stream, {ContentType: file.type}).then(function(one){
     	console.log(destPath)
     	fs.unlink(file.path);
     	var newfile = new File({
     		path: 'https://s3.amazonaws.com/lnmteamconnect-1'+destPath,
     		project: pid,
     		title: file.name
     	})
     	newfile.save(function(err, file) {
     		if(err){
     			res.send(err)
     		}
     		else{
     			res.redirect('/')
     		}
     	})
        //res.send(base + destPath); 
    });
 });

api.post('/getProjectFiles', function(req, res){
	File.find({"project":req.body.projectid}, function(err, files){
		if(err){
			res.send(err);
		}
		else{
			res.json(files);
		}
	})
})

//===================================================SIGNUP AND LOGIN USER===================================================	
api.post('/signupuser', function(req, res) {
	var value = random.integer(1000, 9999);

	var newUser = new User({
		name:  		req.body.name,
		email: 		req.body.email,
		password: 	req.body.password,
		birthdate: 		req.body.birthdate,
		mobile: 	req.body.mobile,
		gender: 	req.body.gender,
		OTPvalue: 	value,
		tag:  		"user"
	});


	nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
		if (err) {
			return res.status(404).send(err);
		}

		if (existingPersistentUser) {
			console.log('exist and verified')
			res.json({
				success: true,
				msg: 'exist'
			});
		}

          // new user created
          else if (newTempUser) {
          	
          	var URL = newTempUser[nev.options.URLFieldName];
          	nev.sendVerificationEmail(req.body.email, URL, function(err, info) {
          		if (err) {
          			console.log(err);
          			return res.status(404).send(err);
          		}
          		console.log('send');
          		res.json({
          			success: true,
          			msg: 'sent'
          		});
          	});

          // user already exists in temporary collection!
      } else {
      	console.log('exist but unverified')
      	res.json({
      		success: true,
      		msg: 'verify'
      	});
      }
  });   
});


// user accesses the link that is sent:
api.get('/email-verification/:URL', function(req, res) {
	console.log('helloooooooooooooooooooooooooooooo')
	var url = req.params.URL;
	nev.confirmTempUser(url, function(err, user) {
		if (user) {
			nev.sendConfirmationEmail(user.email, function(err, info, callback) {
				if (err) {
					return res.status(404).send('ERROR: sending confirmation email FAILED');
				}
				var authkey = '101648AeV6o8poG569d48e4';
				var number = user.mobile;
				var message = 'Hey. Your OTP is '+ user.OTPvalue +'. Thanks.';
				var senderid = 'TCNNCT';
				var route = '4';
				var dialcode = '91';
				msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {
					console.log(response);
				});
				res.redirect('/verifyotp/'+number);
				 // get user to verify otp page
				/*	
					res.json({
              		msg: 'CONFIRMED!',
              		info: info,
              		token: token,
              		id: user._id
          			});
          			*/      
          		});
		} 
		else {
			return res.status(404).send('ERROR: confirming temp user FAILED');
		}
	});
}); 

//RESEND OTP
api.post('/resendotp', function (req, res) {
	var number = req.body.mobile;
	var OTPvalue = random.integer(1000, 9999);
	var OTPvalue1 = OTPvalue;
	var authkey = '101648AeV6o8poG569d48e4';
	var message = 'Hey. Your one time password is '+ OTPvalue1 +'. Thanks.';
	var senderid = 'TCNNCT';
	var route = '4';
	var dialcode = '91';
	
	User.find({mobile:number}).update({$set:{'OTPvalue':OTPvalue}},function (err, user) {
		if(err){
			res.send(err);
			return;
		}
		else{
			msg91.sendOne(authkey, number, message, senderid, route, dialcode, function (response) {
				res.json(response);
			});
		}
	});
})

//VERIFY OTP
api.post('/verifyotp', function (req, res) {
	var number = req.body.mobile;
	var OTPvalue = req.body.OTPvalue;
	User.findOne({
		$and: [
		{ "mobile" : number },
		{ "OTPvalue": OTPvalue }
		]
	})
	.update({$set:{'accountStatus':'active'}},function (err, user) {
		if(err){
			res.send(err);
			return;
		}
		else{
			res.json({ 
				success: true,
				message: 'Successfully SignedUp'
			});
		}
	})
});


//xxxxxxxxxxxxxxxxxxxxxxxxx-------------signup complete--------------------------xxxxxxxxxxxxxxxxxxxxxxxxx


//========================================================================================================

api.post('/loginuser', function(req, res) {

	if(req.body.username.indexOf("@") > -1){
		User.findOne({ 
			email: req.body.username
		}).select('name email mobile password gender age accountStatus').exec(function(err, user) {

			if(err) throw err;

			if(!user) {


				res.send({ message: "User does not exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {
					if(user.accountStatus=='active'){
						///// token
						var token = createUserToken(user);

						res.json({
							success: true,
							message: "Successfully loggedin",
							token: token
						});
					}
					else{
						//send to otp screen.
					}
					
				}
			}
		});
	}
	else{
		User.findOne({ 
			mobile: req.body.username
		}).select('name email mobile password gender age accountStatus').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "User does not exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					if(user.accountStatus=='active'){
						///// token
						var token = createUserToken(user);

						res.json({
							success: true,
							message: "Successfully loggedin",
							token: token
						});
					}
					else{
						//send to otp screen.
					}
				}
			}
		});
	}


});


//===============================================SIGNUP AND LOGIN PROFESSIONAL============================================

api.post('/signupfaculty', function(req, res) {

	var faculty = new Faculty({
		name:  			req.body.name,
		email: 			req.body.email,
		password: 		req.body.password,
		mobile: 		req.body.mobile,
		designation: 	req.body.designation,
		department: 	req.body.department,
		tag:  			"faculty"
	});
	var token = createFacultyToken(faculty);
	faculty.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}

		res.json({ 
			success: true,
			message: 'Successfully SignedUp'
		});
	});
});

api.post('/loginfaculty', function(req, res) {

	if(req.body.username.indexOf("@") > -1){
		Faculty.findOne({ 
			email: req.body.username
		}).select('name email mobile password designation department').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "Faculty does not exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					if(user.accountStatus=='disabled'){

					}
					else{

					///// token
					var token = createFacultyToken(user);

					res.json({
						success: true,
						message: "Successfully loggedin",
						token: token
					});
				}

			}
		}
	});
	}
	else{
		Faculty.findOne({ 
			mobile: req.body.username
		}).select('name email mobile password designation department').exec(function(err, user) {

			if(err) throw err;

			if(!user) {

				res.send({ message: "Faculty does not exist"});
			} else if(user){ 

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password"});
				} else {

					if(user.accountStatus=='disabled'){

					}
					else{
						
					///// token
					var token = createFacultyToken(user);

					res.json({
						success: true,
						message: "Successfully loggedin",
						token: token
					});
				}

			}
		}
	});
	}


});

//=============================================================================================================================


//===============================================SIGNUP AND LOGIN ADMIN============================================

api.post('/signupadmin', function(req, res) {

	var admin = new Admin({
		name:  			req.body.name,
		username:  		req.body.username,
		email: 			req.body.email,
		password: 		req.body.password,
		mobile: 		req.body.mobile,
		tag:  			"admin"
	});
	var token = createAdminToken(admin);
	admin.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}

		res.json({ 
			success: true,
			message: 'Successfully SignedUp',
			token: token,

		});
	});
});

api.post('/loginadmin', function(req, res) {

	Admin.findOne({ 
		username: req.body.username
	}).select('name username email mobile password gender age').exec(function(err, user) {

		if(err) throw err;

		if(!user) {

			res.send({ message: "Admin does not exist"});
		} else if(user){ 

			var validPassword = user.comparePassword(req.body.password);

			if(!validPassword) {
				res.send({ message: "Invalid Password"});
			} else {

					///// token
					var token = createAdminToken(user);

					res.json({
						success: true,
						message: "Successfully loggedin",
						token: token
					});
				}
			}
		});
});

//=============================================================================================================================


// Middleware
api.use(function (req,res,next) {
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	if(token){
		jsonwebtoken.verify(token, secretKey, function(err, decoded){
			if(err){
				res.status(403).send({success: false, message: "Failed to connect"});
			}else {
				req.decoded= decoded;
				next();
			}
		});
	}else {

		res.status(403).send({success: false, message: "false token"});
	}

});

//=============================================================================================================================

api.get('/activeusers', function(req, res){
	User.find({"accountStatus":'active'}, function(err, results){
		if (err) {
			res.json('no users');
			return;
		}
		else{
			res.json(results);
			return;
		}
	})
})

api.get('/allusers', function(req, res){
	User.find({}, function(err, results){
		if (err) {
			res.json('no users');
			return;
		}
		else{
			res.json(results);
			return;
		}
	})
})


api.post('/one_user', function(req, res){
	User.findOne({'mobile':req.body.mobile}).populate('questions').exec(function(err, result){
		if(err){
			res.send(err);
		}
		else{
			res.json(result);
		}
	})
})

api.post('/one_user_byadmin', function(req, res){
	User.findOne({'_id':req.body.userid}).populate('projects chats invites').exec(function(err, result){
		if(err){
			res.send(err);
		}
		else{
			res.json(result);
		}
	})
})


api.post('/user_changestatus', function(req, res){
	User.findOneAndUpdate({"_id":req.body.userid}, {$set:{'accountStatus': req.body.newstatus}}).exec(function(err, result){
		if(err){
			return;
		}
		else{
			res.json(result)
		}
	})
})

api.post('/user_profileupdate', function(req, res){
	var name  	= 	req.body.name,
	age  	= 	req.body.age,
	gender  = 	req.body.gender,
	email  	= 	req.body.email,
	mobile  = 	req.body.mobile

	if(ifUser(req.decoded.tag)){
		User.findOne({_id:req.decoded.id}).update({$set:{'name':name, 
			'age':age, 'gender':gender, 'email':email,'mobile':mobile}}, function(err,response){
				if(err){
					res.send(err);
				}
				else{
					var token = createUserNewToken(req.decoded.id, name, email, age, gender, email, mobile);

					res.json({
						success: true,
						message: "profile successfully updated.",
						token: token
					});
				}
			}) 
	}
	else if(ifAdmin(req.decoded.tag)){
		User.findOne({_id:req.body.userid}).update({$set:{'name':name, 
			'age':age, 'gender':gender, 'email':email,'mobile':mobile}}, function(err,response){
				if(err){
					res.send(err);
				}
				else{

					res.json({
						success: true,
						message: "profile successfully updated."
					});
				}
			}) 
	}

})


api.post('/faculty_profileupdate', function(req, res){
	var name  	= 	req.body.name,
	age  	= 	req.body.age,
	gender  = 	req.body.gender,
	email  	= 	req.body.email,
	mobile  = 	req.body.mobile

	if(ifFaculty(req.decoded.tag)){
		Faculty.findOne({_id:req.decoded.id}).update({$set:{'name':name, 
			'age':age, 'gender':gender, 'email':email,'mobile':mobile}}, function(err,response){
				if(err){
					res.send(err);
				}
				else{
					var token = createFacultyNewToken(req.decoded.id, name, imgURL, email, age, gender, email, mobile);

					res.json({
						success: true,
						message: "profile successfully updated.",
						token: token
					});
				}
			}) 
	}
	else if(ifAdmin(req.decoded.tag)){
		Faculty.findOne({_id:req.body.profid}).update({$set:{'name':name, 
			'age':age, 'gender':gender, 'email':email,'mobile':mobile}}, function(err,response){
				if(err){
					res.send(err);
				}
				else{

					res.json({
						success: true,
						message: "profile successfully updated."
					});
				}
			}) 
	}

})

//============================================== Faculty =====================================================

api.get('/activefaculty', function(req, res){
	Faculty.find({"accountStatus":'active'}, function(err, results){
		if (err) {
			res.json('no faculty');
			return;
		}
		else{
			res.json(results);
			return;
		}
	})
})

api.get('/allfaculty', function(req, res){
	Faculty.find({}, function(err, results){
		if (err) {
			res.json('no faculty');
			return;
		}
		else{
			res.json(results);
			return;
		}
	})
})

api.post('/faculty_changestatus', function(req, res){
	Faculty.findOneAndUpdate({"_id":req.body.facid}, {$set:{'accountStatus': req.body.newstatus}}).exec(function(err, result){
		if(err){
			return;
		}
		else{
			res.json(result)
		}
	})
})

api.get('/one_faculty', function(req, res){
	Faculty.findOne({"_id": req.decoded.id}).populate('projects').exec(function(err, results){
		if(err){
			return;
		}
		else{
			res.json(results);
		}
	})
})

api.post('/one_faculty_byadmin', function(req, res){
	Faculty.findOne({'_id':req.body.facid}).populate('projects chats invites').exec(function(err, result){
		if(err){
			res.send(err);
		}
		else{
			res.json(result);
		}
	})
})

//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


//===================================================== APPOINTMENT =========================================================

api.post('/create_appointment', function(req, res){

	var appointment = new Appointment({

		project:  			req.body.projectid,
		title: 				req.body.title,
		schedule: 			req.body.schedule

	});
	appointment.save(function(err) {
		if(err) {
			res.send(err);
			return;
		}
		io.emit('appointment_'+req.body.projectid, appointment)
		res.json('created')	
	});
})

api.post('/reschedule_appointment', function(req, res){
	Appointment.findOne({"_id":req.body.id}).update({$set:{'schedule': req.body.newschedule, 'updated_by':req.decoded.tag}},function(err, appointment){
		if(err){
			return;
		}
		else{
			io.emit('appointment', appointment)
			res.json('updated')
		}
	})
})

api.post('/approve_appointment', function(req, res){
	Appointment.findOne({"_id":req.body.id}).update({$set:{'status': true}},function(err, appointment){
		if(err){
			return;
		}
		else{
			io.emit('appointment', appointment)
			res.json('confirmed')
		}
	})
})


api.post('/get_appointment', function(req, res){
	Appointment.find({"project":req.body.projectid},function(err, appointment){
		if(err){
			return;
		}
		else{
			res.json(appointment)
		}
	})
})
//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

//================================================== PROJECT ============================================================
api.post('/project_create', function(req, res){
	creator = {id: req.decoded.id, tag: req.decoded.tag};
	var project = new Project({
		created_by: 	creator,
		title: 			req.body.title,
		description: 	req.body.description
	});
	
	var chat = new Chat({
		name: 		req.body.title
	});
	if(ifUser(req.decoded.tag)){
		chat.users.push(req.decoded.id);
		project.users.push(req.decoded.id);
	}
	else if(ifFaculty(req.decoded.tag)){
		chat.faculties.push(req.decoded.id);
		project.faculties.push(req.decoded.id);
	}
	

	project.save(function(err, newProject){
		if (err) {
			return res.send(err);
		}
		else{
			io.emit('project', newProject);
			chat.project = newProject._id;
			chat.save(function(err, newChat){
				if(err){
					return;
				}
				else{
					if(ifUser(req.decoded.tag)){
						User.findOne({"_id":req.decoded.id}).update({$push:{chats: newChat._id, projects: newProject._id}},function(err, pro){
							if(err){
								return;
							}
							else{

							}
						});
					}
					else if(ifFaculty(req.decoded.tag)){
						Faculty.findOne({"_id":req.decoded.id}).update({$push:{chats: newChat._id, projects: newProject._id}},function(err, pro){
							if(err){
								return;
							}
							else{

							}
						});
					}
					io.emit('new_chat_'+req.decoded.id, newChat)
					res.json('success')
				}
			})
		}
	})
})

api.post('/project_invite', function(req,res){
	var invite = new Invite({
		email: req.body.email,
		project: req.body.projid,
		chat: req.body.chatid,
		role: req.body.role,
		created_by: req.decoded.name
	})

	invite.save(function(err, newInvite){
		if(err){
			return res.send(err);
		}
		else{
			var invitemailoptions = {
				from: '"TeamConnect" <lnm.teamconnect@gmail.com>',
				to: invite.email,
				subject: 'Project Invitation',
				text: 'Please click on the link (http://localhost:8080/) to proceed. TeamConnect',
				html: '<b>Please click on the link to proceed. </b> <a href="http://localhost:8080/"TeamConnect</a>'
			};

		// send mail with defined transport object
		transporter.sendMail(invitemailoptions, function(error, info) {
			if (error) {
				return console.log(error);
			}
			res.json('Message sent');
		});
			/*if(req.body.role == 'student'){
				User.findOne({email:req.body.email}, function(err1, user){
					if(err1){
						return res.send(err1);
					}
					else if(!user){
						// send email
					}
					else{
						User.findOneAndUpdate({email:req.body.email}, {$push:{invites:newInvite._id}, new:true} , function(err2, newUser){
							if(err2){
								return res.send(err2);
							}
							else{
								res.json('success');
							}
						})
					}
				})
			}
			else if(req.body.role == 'faculty'){
				Faculty.findOne({email:req.body.email}, function(err1, faculty){
					if(err1){
						return res.send(err1);
					}
					else if(!faculty){
						// send email
					}
					else{
						Faculty.findOneAndUpdate({email:req.body.email}, {$push:{invites:newInvite._id}, new:true} , function(err2, newFaculty){
							if(err2){
								return res.send(err2);
							}
							else{
								res.json('success');
							}
						})
					}
				})
			}*/
		}
	})	
})

api.get('/get_invitations', function(req, res){
	/*if(ifUser(req.decoded.tag)){
		User.findOne({"_id":req.decoded.id}).populate('invites').exec(function(err, results){
			if(err){
				res.send(err);
			}
			else{
				console.log(results);
				var invitations = [];
				results.invites.forEach(function(element){
					Invite.findOne({"_id": req.element._id}).populate('project').exec(function(err, result){
						if(err){
							res.send(err);
						}
						else{
							invitations.push(result)
						}
					})
				})
				res.json(invitations);
			}
		})
	}
	else if(ifFaculty(req.decoded.tag)){
		Faculty.findOne({"_id":req.decoded.id}).populate('invites').exec(function(err, results){
			if(err){
				res.send(err);
			}
			else{
				console.log(results)
				var invitations = [];
				results.invites.forEach(function(element){
					Invite.findOne({"_id": req.element._id}).populate('project').exec(function(err, result){
						if(err){
							res.send(err);
						}
						else{
							invitations.push(result)
						}
					})
				})
				res.json(invitations);
			}
		})
	}
	else{
		res.send('Access Denied.')
	}*/
	Invite.find({"email":req.decoded.email}).populate('project').exec(function(err, results){
		if(err){
			res.send(err);
		}
		else{
			res.json(results);
		}
	})
	
})

api.post('/invite_accept', function(req, res){
	console.log('hello');
	console.log(req.body.invid)
	if(ifUser(req.decoded.tag)){
		Invite.findOneAndUpdate({"_id":req.body.invid}, {status: 'accepted'}).exec(function(err, invite){
			if(err){
				return res.send(err);
			}
			else{
				console.log(invite)
				var chatid = invite.chat;
				console.log(chatid);
				var projid = invite.project;
				Project.findOneAndUpdate({"_id":projid}, {$push:{users:req.decoded.id}}, function(err1, project){
					if(err1){
						return res.send(err1);
					}
					else{
						Chat.findOneAndUpdate({"_id":chatid}, {$push:{users:req.decoded.id}}, function(err0, chat){
							if(err0){
								return res.send(err0);
							}
							else{
								User.findOneAndUpdate({email:req.decoded.email}, {$push:{projects:projid, chats:chatid}} , function(err2, user){
									if(err2){
										return res.send(err2);
									}
									else{
										res.json('success');
									}
								})
							}
						})
					}
				})
			}
		})
	}
	else if(ifFaculty(req.decoded.tag)){
		Invite.findOneAndUpdate({"_id":req.body.invid}, {status: 'accepted'}, function(err, invite){
			if(err){
				return res.send(err);
			}
			else{
				console.log(invite)
				var chatid = invite.chat;
				console.log(chatid);
				var projid = invite.project;
				Project.findOneAndUpdate({"_id":projid}, {$push:{faculties:req.decoded.id}}, function(err1, project){
					if(err1){
						return res.send(err1);
					}
					else{
						Chat.findOneAndUpdate({"_id":chatid}, {$push:{faculties:req.decoded.id}}, function(err0, chat){
							if(err0){
								return res.send(err0);
							}
							else{
								Faculty.findOneAndUpdate({email:req.decoded.email}, {$push:{projects:projid, chats:chatid}} , function(err2, user){
									if(err2){
										return res.send(err2);
									}
									else{
										res.json('success');
									}
								})
							}
						})
					}
				})
			}
		})
	}
})

api.post('/invite_reject', function(req, res){
	console.log(req.body.invid)
	Invite.findOneAndUpdate({"_id":req.body.invid}, {status: 'rejected'}, function(err, result){
		if(err){
			return res.send(err2);
		}
		else{
			res.json('success');
		}
	})
})


api.post('/project_changestatus', function(req, res){
	Project.findOne({"_id":req.body.id}).update({$status:{'status': req.body.newstatus}},function(err, proj){
		if(err){
			return;
		}
		else{
			res.json(proj);
		}
	})
})

api.post('/project_get', function(req, res){
	Project.findOne({"_id": req.body.id}).populate('faculty users').exec(function(err, results){
		if(err){
			return;
		}
		else{
			res.json(results);
		}
	})
})

//==================================================CHAT CHAT CHAT==========================================================

api.post('/start_conversation', function(req,res){

	var students = req.body.newconv.users;
	var faculties = req.body.newconv.faculties;
	var chat = new Chat({
		name: 		req.body.newconv.chatname,
		project: 	req.body.newconv.project,
		users: 		students,
		faculties: 	faculties
	});
	chat.save(function(err, newChat){
		if(err){
			return;
		}
		else{
			students.forEach(function(element){
				User.findOne({"_id":element}).update({$push:{chats: newChat._id}},function(err, pro){
					if(err){
						return;
					}
					else{
						//console.log('added', pro)
					}
				});
				io.emit('new_chat_'+element, newChat)
			})
			faculties.forEach(function(element){
				Faculty.findOne({"_id":element}).update({$push:{chats: newChat._id}},function(err, pro){
					if(err){
						return;
					}
					else{
						//console.log('added', pro)
					}
				});
				io.emit('new_chat_'+element, newChat)
			})

			res.json(newChat)
		}
	})
})


api.post('/send_message', function(req, res){
	var creator = {id: req.decoded.id, name: req.decoded.name, imgURL: req.decoded.imgURL};

	var message = new Message({
		chat: 			req.body.chatid,
		message: 		req.body.message,
		sender: 	 	creator
	});
	message.save(function(err, newMessage){
		if(err){
			return;
		}
		else{
			Chat.findOne({"_id":req.body.chatid}).update({$push:{messages: newMessage._id}}, function(err, result){
				if(err){
					return;
				}
				else{
					io.emit('chat_message_'+req.body.chatid, newMessage)
					res.json('msg sent');
				}
			})
		}
	})
})

api.post('/faculty_getchats', function(req, res){
	Faculty.findOne({"_id":req.decoded.id}).select('chats').populate('chats').exec(function(err, results){
		if(err){
			return;
		}
		else{
			res.json(results);
		}
	})
})

api.post('/user_getchats', function(req, res){
	User.findOne({"_id":req.decoded.id}).select('chats').populate('chats').exec(function(err, results){
		if(err){
			return;
		}
		else{
			console.log('-------------------------',results);
			res.json(results);
		}
	})
})

api.post('/get_onechat', function(req, res){
	Chat.findOne({"_id":req.body.chatid}).populate('project users faculties messages').exec(function(err, result){
		if(err){
			res.send(err);
		}
		else{
			console.log(result)
			res.json(result);
		}
	})
})



//xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

api.get('/me', function(req, res) {
	res.json(req.decoded);
});

return api;

}