var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Appointment = new Schema({

    project: 			{type: Schema.Types.ObjectId, ref:'Project'},
    title:              {type: String},
    schedule:           {type: Date},
    status:             {type: Boolean, default: false},
    created_at:         {type: Date, default: Date.now },
    updated_by: 		{type: String}

})


module.exports = mongoose.model('Appointment', Appointment)