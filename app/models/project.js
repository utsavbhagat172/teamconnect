var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProjectSchema = new Schema({

    title:                              {type:String, required:true},
    description:                        {type:String, required:true},
    faculties:                          [{type: Schema.Types.ObjectId, ref:'Faculty'}],
    users:                              [{type: Schema.Types.ObjectId, ref:'User'}],
    created_at:                         {type: Date, default: Date.now },
    created_by:                         { id: { type: String }, tag:{ type: String }},
    numofabusereports:                  {type: Number, default:0},
    status:                             {type: String, default: 'active'}

})


module.exports = mongoose.model('Project', ProjectSchema)